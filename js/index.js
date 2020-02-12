let countries = [];
let news = [];
let countryMap = new Map();

/* 
country {
    name: "",
    confirmed: 0,
    deaths: 0,
    recovered: 0,
} 
newsObject {
    text: "",
    date: "",
    time: "",
}
timelineObject {
    date: "29-01-2020",
    totalConfirmed: 2000,
}
*/

$(document).ready(()=> {
    initialise();

    $("#countryName").change((e)=> {
        let country = countryMap.get($("#countryName").val());
        if (country != undefined) {
            $('#confirmedCases').val(country.confirmed);
            $("#deaths").val(country.deaths);
            $("#recovered").val(country.recovered);
        }
        else {
            $('#confirmedCases').val("");
            $("#deaths").val("");
            $("#recovered").val("");
        }
    })
})

function initialise() {
    loadCountries();
    loadNews();
}
function loadCountries() {
    // LOAD COUNTRIES FROM LOCAL STORAGE
    countries = JSON.parse(localStorage.countries);
    console.log(countries);

    countries.forEach((value)=> {
        countryMap.set(value.name, value);
    });

    refreshCountries();
}

function loadNews() {
    // LOAD NEWS FROM LOCAL STORAGE
    news = JSON.parse(localStorage.news);
    refreshNews();
}

function saveCountry() {
    // ADD COUNTRY TO LOCAL STORAGE
    let country = {
        name: $('#countryName').val(),
        confirmed: $('#confirmedCases').val(),
        deaths: $('#deaths').val(),
        recovered: $('#recovered').val()
    };

    countryMap.set(country.name, country);
    
    let countryMapEntries = countryMap.entries();
    let countries = Array.from(countryMapEntries, ([key, value]) => value);
    localStorage.countries = JSON.stringify(countries);

    let now = new Date();
    // console.log(now);
    let newsObj = {
        text: `${country.name} has ${country.confirmed} confirmed cases. Within these cases, there are ${country.recovered} recovered cases and an unfortunate ${country.deaths} death cases.`,
        date: `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`,
        time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    };
    news.unshift(newsObj);

    localStorage.news = JSON.stringify(news);


    alert("Country succesfully added!");
    refreshNews();
    refreshCountries();

    return false;
}

function refreshCountries() {
    refreshConfirmedCases();
    refreshTotalDeaths();
    refreshTotalRecovered();
}
function refreshConfirmedCases() {
    let sortedCountries = sortCountries("confirmed");
    $('#confirmedCasesTable').empty();
    sortedCountries.forEach((country)=> {
        $('#confirmedCasesTable').append(`
            <tr data-country='${country.name}'>
                <td>${country.name}</td>
                <td>${country.confirmed}</td>
            </td>
        `);
    })
    
    $('tr').click((e)=> {
        let countryName = $(e.target.parentNode).attr('data-country');
        console.log(countryMap.get(countryName));
    });
}
function refreshTotalDeaths() {
    let sortedCountries = sortCountries("deaths");
    $('#totalDeathsTable').empty();
    sortedCountries.forEach((country)=> {
        $('#totalDeathsTable').append(`
            <tr data-country='${country.name}'>
                <td>${country.name}</td>
                <td>${country.deaths}</td>
            </td>
        `);
    })
}
function refreshTotalRecovered() {
    let sortedCountries = sortCountries("recovered");
    $('#totalRecoveredTable').empty();
    sortedCountries.forEach((country)=> {
        $('#totalRecoveredTable').append(`
            <tr data-country='${country.name}'>
                <td>${country.name}</td>
                <td>${country.recovered}</td>
            </td>
        `);
    })
}
function sortCountries(sortKey) {
    let clone = Array.from(countries);

    clone.sort((e1,e2)=> {
        return parseInt(e2[sortKey]) - parseInt(e1[sortKey]);
    })
    return clone;
}

function refreshNews() {
    $('#news-list').empty();
    news.forEach((value)=> {
        console.log(value.date);
        if (value != undefined) {
            $('#news-list').append(`
                <li class='list-group-item'>
                    <blockquote class='blockquote>
                        <p class='mb-0'>${value.text}</p>
                        <footer class='blockquote-footer'>${value.date}, ${value.time}</footer>
                    </blockquote>
                </li>
            `);
        }
    });
}