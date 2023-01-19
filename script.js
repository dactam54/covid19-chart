const countries = document.querySelector('datalist');
const search = document.querySelector('#search');
const date = document.querySelector('#date');
const nameCountry = document.querySelector('#name-country');
const confirmed = document.querySelector('.confirmed');
const deaths = document.querySelector('.deaths');
const recovered = document.querySelector('.recovered');
const chart = document.querySelector('.chart');

let dataChart = [];

const API_URL = "https://api.covid19api.com/summary";

async function covid(country){
    countries.innerHTML = `<option value="World">World</option>`;
    resetValue(confirmed);
    resetValue(deaths);
    resetValue(recovered);

    const res = await fetch(API_URL);
    const data = await res.json();
    console.log(country)

    if(res.status === 4 || res.status === 200){
        date.textContent = new Date(data.Date).toDateString();

        if(country === '' || country === 'World'){
            const {TotalConfirmed,TotalDeaths,TotalRecovered,NewConfirmed,NewDeaths,NewRecovered} = data.Global;
            total(TotalConfirmed,TotalDeaths,TotalRecovered);
            newUpdate(NewConfirmed,NewDeaths,NewRecovered);

            nameCountry.textContent = 'The World';
            dataChart = [TotalConfirmed,TotalDeaths,TotalRecovered];
        };

        data.Countries.forEach(item =>{
            const option = document.createElement('option');
            option.value = item.Country;
            option.textContent = item.Country;
            countries.appendChild(option);

            if(country === item.Country){
                total(item.TotalConfirmed,item.TotalDeaths,item.TotalRecovered);
                newUpdate(item.NewConfirmed,item.NewDeaths,item.NewRecovered);

                nameCountry.textContent = item.Country;
                dataChart = [item.TotalConfirmed,item.TotalDeaths,item.TotalRecovered];
            }
        });

        drawChart(dataChart);

    }else{
        chart.innerHTML = `<h2>Loading.....</h2>`;
    }
}

const speed = 100;

function counting(target, element){
    const inc = target / speed;
    const count = +element.textContent;
    if(count < target){
        element.textContent = Math.ceil(count + inc);
        setTimeout(()=>{
            counting(target, element)
        },1)

    }else{
        element.textContent = target;
    }
};

function total(Confirmed,Deaths,Recovered){
    counting(Confirmed, confirmed.children[1]);
    counting(Deaths, deaths.children[1]);     
    counting(Recovered, recovered.children[1]);
};

function newUpdate(Confirmed,Deaths,Recovered){
   counting(Confirmed, confirmed.children[2]);
   counting(Deaths, deaths.children[2]);
   counting(Recovered, recovered.children[2]);
};

function resetValue(element){
    element.children[1].textContent = 0;
    element.children[2].textContent = 0;
};


function drawChart(data){
    chart.innerHTML = '';
    const ctx = document.createElement('canvas');
    chart.appendChild(ctx);
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Confirmed', 'Total Deaths', 'Total Recovered'],
            datasets: [{
                label: nameCountry.textContent,
                data: data,
                backgroundColor: ['crimson','black','yellow'],
            }]
        },
        options: {}
    });
};

covid(search.value);

const btnSearch = document.querySelector('button');
btnSearch.addEventListener('click', (e)=>{
    e.preventDefault();
    covid(search.value);
    search.value = '';
})

