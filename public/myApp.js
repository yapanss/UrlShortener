$(document).ready(() =>{
	$('button').click((e) => {
		e.preventDefault();
		// alert('bonjour');
		var urle = $('#url').val();
		// var urll = new URL(urle);
		// console.log(urll)
		var data = {
			fullUrl: urle
		};
		$.post( "/api/shorturl/new", data)
		.then((result) => {
			alert(JSON.stringify(result));
		});

		// alert(data);
	})
})