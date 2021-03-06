var assert = require('assert');
var linq = require('../linqnode');
var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
linq.linqify(a);
var words = ["aragorn", "gimli", "frodo", "sam", "boromir", "gandalf"];
linq.linqify(words);
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
linq.linqify(cars);

describe('Where', function(){
	describe('#filtering', function(){
		var filtered = linq.where(a, function(num) { return num > 5; });
		it('shoud have numbers bigger than 5', function(){
			filtered.forEach(function(n){
				assert.equal(n > 5, true);
			});
		});
	});
});

describe('Select', function() {
	describe("#transformation", function(){
		var transformed = linq.select(a, function(num){
			return {
				name:"Hello, item " + num,
				num: num
			};
		});
		it('should have correct transformation applied', function(){
			transformed.forEach(function(item){
				assert.equal(item.name, "Hello, item " + item.num);
			});
		});
	});
});

describe('ToList', function(){
	describe('#to list should return array', function(){
		var to_l = a.where(function(n) { return n >= 2; }).to_list();
		it('sholud have correct length', function(){
			assert.equal(to_l.length, a.length - 1);
		});
	});
});

describe("Chaining", function(){
	describe("#chain methods", function(){
		var MAX_LEN = 4;
		var characters_with_long_names = linq.where(words, function(w){
			return w.length > MAX_LEN;
		});
		var chained = characters_with_long_names.where(function(c) { 
			return c[0] === 'a';
		});
		it('Should have been chained correctly', function(){
			assert.equal(linq.to_list(chained).length, 1);
		});
	});
});

describe("Linqify", function(){
	describe("#attaching linq methods", function(){
		var tmp = ["a", "b", "c"];
		function assert_linq(true_or_false){
			assert.equal(true_or_false, typeof tmp.where === 'function');
			assert.equal(true_or_false, typeof tmp.select === 'function');
			assert.equal(true_or_false, typeof tmp.to_list === 'function');
		}
		it('should have no linq methods', function(){
			assert_linq(false);
		});
		it('should have all methods', function(){
			linq.linqify(tmp);
			assert_linq(true);
		});
	});
});

describe("Order By", function(){
	describe("#Ordering a simple number array", function(){
		var entropy = [4, 3, 8, 1, 100, 2, 33];
		linq.linqify(entropy);
		var ordered = entropy.order_by(function(n) { return n; }).to_list();

		it('should have the same length', function(){
			assert.equal(entropy.length, ordered.length);
		});
		it('should be ordered', function(){
			for (var i = 1; i < ordered.length; i++){
				assert.equal(true, ordered[i - 1] < ordered[i]);
			}
		});
	});
	describe("#Ordering a complex structure", function(){
		var persons = [
			{ 
				Name: "1",
				Age: 32
			},
			{ 
				Name: "2",
				Age: 2
			},
		];
		linq.linqify(persons);
		var ordered = persons.order_by(function(p) { return p.Age;}).to_list();
		it("Should be ordered", function(){
			assert.equal(ordered[0].Age, 2);
		});
	});
});

describe("Group by", function(){
	describe("Group by property", function(){
		var grouped_cars = cars
							.group_by(function(car) { return car.Make; });
		it('Should have two groups', function(){
			assert.equal(grouped_cars.to_list().length, 2);
		});
		it('Mazda group should have 4 members & Toyota -- 2', function(){
			grouped_cars.keys(function(key){
				var val = grouped_cars.value(key);
				if (key === 'Mazda'){
					assert.equal(val.length, 4);
				} else if (key === 'Toyota'){
					assert.equal(val.length, 1);
				}
			});
		});
	});
});

describe("Order By Desc", function(){
	describe("#Ordering a simple number array", function(){
		var entropy = [4, 3, 8, 1, 100, 2, 33];
		linq.linqify(entropy);
		var ordered = entropy.order_by_desc(function(n) { return n; }).to_list();

		it('should have the same length', function(){
			assert.equal(entropy.length, ordered.length);
		});
		it('should be ordered', function(){
			for (var i = 1; i < ordered.length; i++){
				assert.equal(true, ordered[i - 1] > ordered[i]);
			}
		});
	});
	describe("#Ordering a complex structure", function(){
		var persons = [
			{ 
				Name: "1",
				Age: 1
			},
			{ 
				Name: "2",
				Age: 2
			},
		];
		linq.linqify(persons);
		var ordered = persons.order_by_desc(function(p) { return p.Age;}).to_list();
		it("Should be ordered", function(){
			assert.equal(ordered[0].Age, 2);
		});
	});
});

describe("First", function(){
	describe("#Taking the first element", function(){
		var first = a.first(function(n) { return n > 3; });
		it('Should have selected 4', function(){
			assert.equal(first, 4);
		});
	});
});

describe("ThenBy", function(){

	describe("ThenBy sorting of complex structure", function(){
		var ordered = cars
			.order_by(function(car) { return car.Make; })
			.then_by(function(car) { return car.Model; })
			.then_by(function(car) { return car.Year; })
			.to_list();
		it("Should have Mazda 3 first", function(){
			var first = ordered[0];
			assert.equal("3", first.Model);
			assert.equal("Mazda", first.Make);
			assert.equal(2009, first.Year);
		});
	});
	describe("ThenByDesc sorting of complex structure", function(){
		var ordered_desc = cars
			.order_by(function(car) { return car.Make; })
			.then_by_desc(function(car) { return car.Model; })
			.then_by_desc(function(car) { return car.Year; })
			.to_list();
		it("Should have Mazda 6 first", function(){
			var first = ordered_desc[0];
			assert.equal("Mazda", first.Make);
			assert.equal("6", first.Model);
			assert.equal(2011, first.Year);
		});
	});
	describe("Complex query", function(){
		var mazda_cars = cars
					.where(function(car) { return car.Make === "Mazda"; })
					.order_by(function(car) { return car.Model; })
					.then_by_desc(function(car) { return car.Year; })
					.select(function(car) { return { Model: car.Model, Year: car.Year, Make: "MAZDA" }})
					.to_list();
		it("Should have select properly", function(){
			assert.equal(4, mazda_cars.length);
		});

	});
});

describe("Complex chaining", function(){
	var all_cars = [
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
	linq.linqify(all_cars);
	var mazda_cars = all_cars
				.where(function(car) { return car.Make === "Mazda"; })
				.order_by(function(car) { return car.Model; })
				.then_by_desc(function(car) { return car.Year; })
				.select(function(car) { return { CarModel: car.Model, YearOfModel: car.Year, CarMake: "MAZDA" }});
	it('Should have 4 cars', function(){
		assert.equal(mazda_cars.to_list().length, 4);
	});
	it('All of them should have make MAZDA', function(){
		mazda_cars.forEach(function(car){
			assert.equal(car.CarMake, "MAZDA");
		});
	});
	var grouped_cars = mazda_cars
						.group_by(function(car) { return car.CarModel;});
	it('Should be able to group by model', function(){
		grouped_cars.forEach(function(group){
			var key = group.key;
			assert.equal(true, key === "6" || key === "3");
			var val = group.val;
			assert.equal(2, val.length);
		});
	});
	it('Should be able to query group keys', function(){
		grouped_cars.keys(function(key){
			assert.equal(true, key === "6" || key === "3");
			var val = grouped_cars.value(key);
			assert.equal(2, val.length);
		});
	});
	it('Should be able to use select_many to flatten a grouping result', function(){
		var grouped_cars = all_cars
							.group_by(function(car) { return car.Make; })
							.where(function(group) { return group.key === "Mazda"; })
							.select_many(function(group) { return group.val; })
							.to_list();	
		assert.equal(grouped_cars.length, 4);
	});
});
