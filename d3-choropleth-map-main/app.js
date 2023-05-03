const urlEducation = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const urlCounty = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationData 
let countyData
let plot = d3.select('#plot')
let tooltip = d3.select('#tooltip')
//fetch data 
const fetchData = () =>{
    axios.all([
        axios.get(urlEducation),
        axios.get(urlCounty)
      ])
      .then(responseArr => {
        //this will be executed only when all requests are complete
        educationData=responseArr[0].data
        countyData=topojson.feature(responseArr[1].data,responseArr[1].data.objects.counties).features //topojson.feature will convert the data we got to geojson, feature collections
        console.log(educationData)
        console.log(countyData)
        plotMap();
      }).catch(e=>console.log('ERROR WHILE FETCHING',e))
}
const plotMap = () =>{
    plot.selectAll('path').data(countyData).enter().append('path').attr('d',d3.geoPath()).attr('class','county')
    .attr('fill',countyDataEach=>{
        let id = countyDataEach.id;
        let county = educationData.find(val=>val.fips===id)
        let percentage = county.bachelorsOrHigher
        return percentage <3?'#ade8f4':percentage<12?'#90e0ef':percentage<21?'#48cae4':percentage<30?'#00b4d8':percentage<39
        ?'#0096c7':percentage<48?'#0077b6':percentage<57?'#023e8a':percentage<66?'#03045e':null
    })
    .attr('data-fips',countyDataEach=>countyDataEach.id)//countyData id same as education data flip
    .attr('data-education',countyDataEach=>(educationData.find(val=>val.fips===countyDataEach.id)).bachelorsOrHigher)
    .on('mouseover',(e,countyDataEach)=>{ //passing event helps solve the tooltip with the d3 version issue
        tooltip.transition()
        .style('visibility','visible')
        let id = countyDataEach.id;
        let county = educationData.find(val=>val.fips===id)
        tooltip.text(`${county.bachelorsOrHigher}% ${county['area_name']} ${county.state}`)
        tooltip.attr('data-education',county.bachelorsOrHigher)
    })
    .on('mouseout',countyDataItem=>{
        tooltip.transition().style('visibility','hidden')
    })
}

fetchData();

