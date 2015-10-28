var assert = require('assert');
var linq = require('../linqnode');
var a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var words = ["aragorn", "gimli", "frodo", "sam", "boromir", "gandalf"];

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
