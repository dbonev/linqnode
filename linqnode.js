module.exports = {
	where : _where,
	select: _select,
	order_by: _order_by,
	to_list: _to_list,
	linqify: _linqify
}

function _linqify(sequence){
	sequence.where = function(filter){ return _where(sequence, filter); };
	sequence.select = function(transform) { return _select(sequence, transform); };
	sequence.order_by = function(selector) { return _order_by(sequence, selector); };
	sequence.to_list = function() { return _to_list(sequence); };
}

function _where(sequence, filter){
	var result = new IEnumerableFilter(sequence, filter);
	return result;
}

function _select(sequence, transform){
	var result = new IEnumerableTransform(sequence, transform);
	return result;
}

function _order_by(sequence, selector){
	var result = new IEnumerableOrderBy(sequence, selector);
	return result;
}

function _to_list(sequence){
	var result = [];
	sequence.forEach(function(item){
		result.push(item);
	});
	_linqify(result);
	return result;
}

function IEnumerableTransform(sequence, transform){
	this.forEach = function(action){
		sequence.forEach(function(item){
			var transformed = transform(item);
			action(transformed);
		});
	};
	_linqify(this);
}

function IEnumerableFilter(sequence, filter){
	this.forEach = function(action){
		sequence.forEach(function(item){
			if (filter(item)){
				action(item);
			}
		});
	};
	_linqify(this);
}

function IEnumerableOrderBy(sequence, selector){
	this.forEach = function(action){
		var result = [];
		sequence.forEach(function(item){
			__insert_at_correct_position(result, item, selector);
		});
		result.forEach(action);
	};
	_linqify(this);
}

function __insert_at_correct_position(array, item, selector){
	var value_to_compare = selector(item);
	for (var i = 0; i < array.length; i++){
		var i_value = selector(array[i]);
		if (value_to_compare < i_value){
			array.splice(i, 0, item);
			return;
		}
	}
	// we're at the end of the array and haven't found a place
	// so simply push it
	array.push(item);
}
