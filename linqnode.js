module.exports = {
	where : _where,
	select: _select,
	to_list: _to_list
}

function _where(sequence, filter){
	var result = new IEnumerableFilter(sequence, filter);
	return result;
}

function _select(sequence, transform){
	var result = new IEnumerableTransform(sequence, transform);
	return result;
}

function IEnumerableTransform(sequence, transform){
	this.forEach = function(action){
		sequence.forEach(function(item){
			var transformed = transform(item);
			action(transformed);
		});
	};
	this.where = function(filter){ return _where(this, filter); };
	this.select = function(transform) { return _select(this, transform); };
}

function _to_list(sequence){
	var result = [];
	sequence.forEach(function(item){
		result.push(item);
	});
	return result;
}

function IEnumerableFilter(sequence, filter){
	this.forEach = function(action){
		sequence.forEach(function(item){
			if (filter(item)){
				action(item);
			}
		});
	};
	this.where = function(filter){ return _where(this, filter); };
	this.select = function(transform) { return _select(this, transform); };
}
