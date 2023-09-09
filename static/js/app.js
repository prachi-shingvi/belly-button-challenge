const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

let x = []
let y = []
let samples = [];
let metadata = [];
// layout of bar chart
const barLayout = {
    yaxis: {
        autorange:'reversed'
    }
};

const bubblelayout = {
    xaxis:{title:{text:'OTU ID'}},
    height:750,
    width:1500,
}

// Function to set data from given id
function setData(id){
    const id_info = samples.filter(function(item){
        return item['id']==id;
    })
    const xval=id_info[0]['sample_values'].slice(0,10);
    const yval=id_info[0]['otu_ids'].slice(0,10).map(function (item)  {
        return 'OTU ' + item;
    });
    const labelsval = id_info[0]['otu_labels'].slice(0,10)
    const plot = {
        x:xval,
        y:yval,
        type: 'bar',
        orientation : 'h',
        customdata: labelsval,
        hovertemplate: '%{customdata}'
    }
    drawBarPlot(plot);
}

// function to set demographic info of selected id
function setDemoInfo(id){
    const demo_information=metadata.filter(function(item){
        return item['id']==id;
    })[0];

    d3.select('#demo_id').text('id: ' + demo_information['id']);
    d3.select('#demo_ethnicity').text('ethnicity: ' + demo_information['ethnicity']);
    d3.select('#demo_gender').text('gender: ' + demo_information['gender']);
    d3.select('#demo_age').text('age: ' + demo_information['age']);
    d3.select('#demo_location').text('location: ' + demo_information['location']);
    d3.select('#demo_bbtype').text('bbtype: ' + demo_information['bbtype']);
    d3.select('#demo_wfreq').text('wfreq: ' + demo_information['wfreq']);

}

// function for BubbleChart
function BubbleChart(id){
    const id_info = samples.filter(function(item){
        return item['id']==id;
    })[0]
    let xaxis=id_info['otu_ids'];
    let yaxis=id_info['sample_values'];
    let markers=id_info['sample_values'];
    let colors=id_info['otu_ids'];
    let labels=id_info['otu_labels'];

    let trace={
        x:xaxis,
        y:yaxis,
        text:labels,
        mode:'markers',
        marker:{
            size:markers,
            color:colors,
            colorscale:"Earth"
        }
    }

    drawBubblePlot(trace);
}
// On change function which is called when id is selected from drop down
function optionChanged(id_value){
    setData(id_value);
    setDemoInfo(id_value);
    BubbleChart(id_value);
}

// Initial function to run
function init() {
    d3.json(url).then(function(data){
        samples = data['samples'];
         metadata = data['metadata']
        samples.map(function(item){
            const item_id = item['id'];
            const option = d3.select('select').append('option')
            option.text(item_id);
            option.attr('value', item_id);
            
        });
        const info = d3.select('#sample-metadata').append('p')
        info.attr('id','demo-info');

        info.append('div').attr('id','demo_id').append('br')
        info.append('div').attr('id','demo_ethnicity').append('br')
        info.append('div').attr('id','demo_gender').append('br')
        info.append('div').attr('id','demo_age').append('br')
        info.append('div').attr('id','demo_location').append('br')
        info.append('div').attr('id','demo_bbtype').append('br')
        info.append('div').attr('id','demo_wfreq')
    
        // Initial graph to set when web page loads
        setData(samples[0]['id'])
        setDemoInfo(samples[0]['id'])
        BubbleChart(samples[0]['id'])
    });
}


// Function to draw bar chart with given trace data
function drawBarPlot(newdata) {
    Plotly.newPlot("bar", [newdata], barLayout);
}

function drawBubblePlot(newdata){
    Plotly.newPlot("bubble",[newdata],bubblelayout);
}

init();