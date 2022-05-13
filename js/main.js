/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Name: ___Yao Chen__________ Student ID: __134082197________ Date: ______03 Feb___
*
*
********************************************************************************/
let restaurantData = [];
let currentRestaurant = {};
let page = 1;
const perPage = 10;
let map = null;

function avg(grades) {
    var sum = 0, average = 0;
    for (var i = 0; i < grades.length; i++) {
        sum += grades[i].score
    }
    average = (sum / grades.length).toFixed(2);

    return average;

};

const tableRows = _.template(`
    <% restaurantData.forEach(data=>{ %>
        <tr data-id=<%- data._id%>>
            <td><%- data.name %></td>
            <td><%- data.cuisine %></td>
            <td><%- data.address.building %> <%- data.address.street %></td>
            <td><%- avg(data.grades) %>
        </tr>
    <% }); %>
`);

function loadRestaurantData() {
    fetch(`https://arcane-bastion-88351.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`)
        .then(res => res.json())
        .then(returned => {
            restaurantData = returned;
            let tableHTML = tableRows(restaurantData);
            $("#restaurant-table tbody").html(tableHTML);
            $("#current-page").html(page);

        }).catch(err => {
            console.log("unable to load restaurant data");
        });


};

$(function () {

    //load date
    loadRestaurantData();

    $("#restaurant-table tbody").on("click", "tr", function () {
        $(this).css({ "background-color": "#eff6f7" });
        //get currentRestaurant with request id from data
        currentRestaurant = restaurantData.find(u => u._id == $(this).attr("data-id"));

        //set HTML content with name of currentRestaurant
        $(".modal-title").html(currentRestaurant.name);

        //set HTML content and insert more content
        $("#restaurant-address").html(currentRestaurant.address.building);
        $("#restaurant-address").append(" " + currentRestaurant.address.street)

        //open Modal window
        $("#restaurant-modal").modal({
            backdrop: "static",
            keyboard: false
        });

    });

    $("#previous-page").on("click", function () {
        if (page > 1) {
            page--;
        }
        loadRestaurantData();
    });

    $("#next-page").on("click", function () {
        page++;
        loadRestaurantData();

    });

    //triggers once a modal window is fully shown
    $('#restaurant-modal').on('shown.bs.modal', function () {
        map = new L.Map('leaflet', {
            center: [currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]],
            zoom: 18,
            layers: [
                new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            ]
        });

        L.marker([currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]]).addTo(map);
    });

    $('#restaurant-modal').on('hidden.bs.modal', function () {
        map.remove();
    });


});