$(document).ready(() =>{
	$('button').click((e) => {
		e.preventDefault();
		// alert('bonjour');
		var data = {
			fullUrl: document.forms[0].elements["url"].value,
			short: 5
		}
		$.post( "/api/shorturl/new", data)
		.then((result) => {
			alert(JSON.stringify(result))
		});

		// alert(data);

	})
})