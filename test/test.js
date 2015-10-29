var assert = require('assert');
var linq = require('../linqnode');
var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
linq.linqify(a);
var words = ["aragorn", "gimli", "frodo", "sam", "boromir", "gandalf"];
linq.linqify(words);

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
