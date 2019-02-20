

  // Indeks jakości powietrza Polanka i Dąbrowskiego
  let url1 = 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/943';
  let url2 = 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/944';
  let url = 'http://api.gios.gov.pl/pjp-api/rest/aqindex/getIndex/'
  // Stanowiska pomiarowe Polanka i Dąbrowskiego
  let url3 = 'http://api.gios.gov.pl/pjp-api/rest/station/sensors/943';
  let url4 = 'http://api.gios.gov.pl/pjp-api/rest/station/sensors/944';
  let urlSensors = 'http://api.gios.gov.pl/pjp-api/rest/station/sensors/';
  let myData = findAll;
  let city;
  let cityId;
  let stations = [];
  let paramCode;
  let paramName;
  let cityNames =[];
  let article = $('article');
  let button = $('button');
  let myArr = [];
  let cityArr = [];
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  
  button.click(chooseCity);

 function fetchAirQuality(element, key){
    $('.frame').remove();
    let cityUrl = element[key].id.toString();
    city = element;
    fetch(proxyUrl+url+cityUrl)
    .then(response => response.json())
    .then(contents =>{
    $('article').append(`<h2>${city[key].stationName}</h2>`);
      for(let idx in contents){
        if(idx !== null && idx.indexOf('IndexLevel') !== -1){
          let paramIdx = idx;
          idx = idx.replace('IndexLevel', '');
          const newName = cityNames.filter(function(newElem,index){
            console.log(newElem[index]);
            return newElem[index].stationId === element[key].id;
          })
          const rogi = newName[0].find(function(myElem,index){
            let myElemCode =  myElem.param.paramCode.toLowerCase();
            return myElemCode === idx;
          })
          if( rogi === undefined
            || contents[paramIdx === null]) console.log('Nie ma takiego numeru');
          else $('article').append(`<div class = "frame">
          <p class = "param-name">${rogi.param.paramName}</p>
          <p class = "param-result">${contents[paramIdx].indexLevelName}</p>
          </div>`);
        }
        
      }
      let myHeight = $('article').height();
      if(myHeight > 300) $('article').addClass('scroll');
    })
    .then(fetchParamName(element[key]))
    .catch(err=>{
      console.log(err)
    })
 }

 function showCity(select){
   $('article div').remove();
   $('h2').remove();
   chosenCity = select.val();
   chosenCity = chosenCity.toString()
   city = myData.filter(elem=>{
     return elem.city.name === chosenCity;
   });
      let h1 = $('h1');
      h1.text(`Jakość powietrza - ${city[0].city.name}`);
      for(let key in city){
        cityId = city[key].id;
      }
      for(let key in city){
        fetchAirQuality(city, key);
      }
}

 function chooseCity(){
      button.hide();
      let header = $('header');
      let select = $('<select></select>');
      header.append(select);
      let city = myData.map(element=>{
        return element.city.name;
      })
      let uniq = new Set(city);
      let rogi = [...uniq];
      rogi.sort();
      rogi.map(element=>{
        let option = $('<option></option>')
        option.text(element);
        option.val(element);
        select.append(option);
      });
      select.click(function(){
        showCity(select);
      })
 }

 function fetchParamName (cityUrl){
    cityUrl = cityUrl.id.toString();
    fetch(proxyUrl + urlSensors + cityUrl)
    .then(response => response.json())
    .then(contents => {
      cityNames.push(contents);
    });
  }

  function showTime () {
    let myInterval = setInterval(function(){
      let d = new Date()
      let hours = d.getHours();
      let minutes = d.getMinutes();
      minutes = (minutes < 10 ? '0' : '') + minutes;
      let seconds = d.getSeconds();
      seconds = (seconds <10 ? '0' : '') + seconds;
      $('.time').html(`${hours} : ${minutes} : ${seconds}`)
    }, 1000)
  };

  function showDate () {
    const days = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
    let d = new Date();
    let day = d.getDate();
    let dayName = d.getDay();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    day = (day < 10 ? '0' : '') + day;
    month = (month < 10 ? '0' : '') + month;
    $('.day-name').html(`${days[dayName]}`);
    $('.date').html(`${day} - ${month} - ${year}`);
  };

  showTime();
  showDate();
