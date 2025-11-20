We're building an alternate frontend for an organization called Bicycle Benefits. They provide a program where local businesses offer discounts to customers who arrive by bicycle. The goal of this project is to create a user-friendly web application that allows users to easily find participating businesses based on their device location.

The API for the project is as follows:
https://bicyclebenefits.org/members?categories=&city_id=6&member=&range=10&stickers=0&pumps=0 (for Madison, WI. we only care about Madison right now)

Mapbox API token: pk.eyJ1IjoidHN1bmFtaXNxdW9kIiwiYSI6ImNsNzUzZnhsZTFud3ozcG4xNHd1eHZmdHkifQ.FIlRNyjhXGDiE_K4nStjzA

Response:
Object { members: (158) […], city: {…} }

city: Object { id: 6, created_at: "2014-03-04T14:59:57.000000Z", updated_at: "2024-08-14T16:49:02.000000Z", … }
created_at: "2014-03-04T14:59:57.000000Z"
facebook_url: "https://m.facebook.com/profile.php?id=675624565817564&_rdr"
id: 6
latitude: "43.074761000000000"
longitude: "-89.383761300000000"
name: "Madison"
partners_html: '<a href="http://www.wisconsinbikefed.org"><img src="https://store.wisconsinbikefed.org/uploads/b/9f087a29fea7b035de1420cb505004c85a17dbd99df90727c44b15a01c29fe08/2.12.2024_65caa1b98455d5.95189883.jpeg?width=400"></a>'
state: Object { id: 49, name: "Wisconsin", short_name: "WI", … }
state_id: 49
updated_at: "2024-08-14T16:49:02.000000Z"
​​
members: Array(158) [ {…}, {…}, {…}, … ]
0: Object { id: 283, name: "The Wine & Hop Shop", status: 1, … }
address: "1919 Monroe St."
air_pump: 0​​​​
category: Object { id: 11, name: "Grocery & Markets", created_at: "2014-03-31T00:31:38.000000Z", … }
category_id: 11
city_id: 6
discount: "10% off (excludes other offers)"
id: 283
latitude: "43.064044000000000"
longitude: "-89.417914000000000"
name: "The Wine & Hop Shop"
phone: "(608) 257-0099"
shipping_zipcode: null
status: 1
stickers_available: 1​​​​
web: "http://wineandhop.com/"
zipcode: "53711"
