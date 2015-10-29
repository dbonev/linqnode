# linqnode
A minimalistic, simple, javascript LINQ library
The core, essential LINQ functionality C# developers are used to in a very minimal, unobtrusive and tiny (less than 200 lines of code) library.
This library includes only the very basic, and most used parts (where, select, order by, then by).
All iterators are with delayed execution (the collection is _not_ iterated until you call to_list() or forEach()).

Usage:
```
var linq = require('../linqnode');
// define a data structure
var cars = [
	{
		Make: "Toyota",
		Model: "Avensis",
		Year: 2008
	},
	{
		Make: "Mazda",
		Model: "6",
		Year: 2009
	},
	{
		Make: "Mazda",
		Model: "6",
		Year: 2011
	},
	{
		Make: "Mazda",
		Model: "3",
		Year: 2010
	},
	{
		Make: "Mazda",
		Model: "3",
		Year: 2009
	}
];
// optionally, linqify it (this will give you .where / .select and friends functions within the datastructure)
linq.linqify(cars);

// filter, order, select
var mazda_cars = cars
				.where(function(car) { return car.Make === "Mazda"; })
				.order_by(function(car) { return car.Model; })
				.then_by_desc(function(car) { return car.Year; })
				.select(function(car) { return { CarModel: car.Model, YearOfModel: car.Year, CarMake: "MAZDA" }})
				.to_list();

```
