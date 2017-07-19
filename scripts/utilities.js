var callBack = function() {
	console.log("This is a callback");
}

var forEach = function(points)
{
	for (i = 0; i < points.length; i++)
	{
		points[i].callBack;
	}
}