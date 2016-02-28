"# urlfetchor"
The process is listenning on localhost:3000.

Homepage would provide two inputs, url you want to get, and jobguid you want to get result from.

After input a valid url, the page would jump to path '/createjob', whose page display corresponded jobguid and a form to get the job result.

The html queried back was tricky, cause a lot image and links are using relative path instead of absolute path. So I insert a script file when return the html, which add the domain address to all images src and links href.
But this has a obvious error, that script in side of the page would not work if they also use relative address, such as redirect to an url or post to an url. A basic example would be google.com search button.

I didn't spend much time with view structure. I haven't worked with production client side for a long time.
