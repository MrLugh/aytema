<!DOCTYPE html>
<!--[if lt IE 7]><html class="lt-ie9 lt-ie8 lt-ie7" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><![endif]-->
<!--[if IE 7]><html class="lt-ie9 lt-ie8" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><![endif]-->
<!--[if IE 8]><html class="lt-ie9" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><![endif]-->
<!--[if gt IE 8]><!--><html xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]-->
<html>
<head>

	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width" />
    <title>CloudCial</title>

    <!-- Css -->
    <?php
	echo $this->Html->css('landing/normalize.css');
	echo $this->Html->css('landing/foundation.min.css');
	echo $this->Html->css('landing/style.css');
	echo $this->Html->css('landing/ie.css');
	echo $this->Html->css('landing/flexslider.css');
    ?>
	<link href='http://fonts.googleapis.com/css?family=Noto+Sans:400,700' rel='stylesheet' type='text/css'>
	<link href='http://fonts.googleapis.com/css?family=Cabin+Condensed:600' rel='stylesheet' type='text/css'>


    <!-- Js -->
    <?php 
	echo $this->Html->script('landing/vendor/custom.modernizr.js');
    ?>

</head>

<body id="body" data-magellan-destination="body">

	<div id="top" data-magellan-expedition="fixed" data-magellan-destination="top" class="top">
		<div class="row">
			<div class="large-12 columns">
				<nav class="top-bar">
				  <ul class="title-area">
				   <li class="name logo">
				      	<a href="#"><img src="http://cloudcial.com/img/aytema-horizontal.png" style="max-width:240px;margin-top: 3px;"  alt=""></a>
				    </li>
				    <li class="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>
				  </ul>
				
				  <section class="top-bar-section">
				    <ul class="right" id="menu">
				      <li data-magellan-arrival="body"><a href="#body">Home</a></li>
				      <li data-magellan-arrival="features"><a href="#features">Features</a></li>
				      <li data-magellan-arrival="product"><a href="#product">Product</a></li>
				      <li data-magellan-arrival="screenshot"><a href="#screenshot">Gallery</a></li>
				      <li data-magellan-arrival="pricing"><a href="#pricing-table">Pricing</a></li>
				      <li data-magellan-arrival="contact"><a href="#contact">Contact Us</a></li>
				      <li><a href="/dashboard/">Sig In</a></li>
				    </ul>
				  </section>
				</nav>
			</div>
		</div>
	</div>

	<header id="header">
		<div class="row">
	    
	    	<div class="large-6 columns">
				<div id="teaser-slider-2">
					<div class="flexslider">
						<ul class="slides">
							<li>
								<img src="http://cloudcial.com/img/landing/slides/iphoneshots-1.jpg" alt="Petrichor - slider">
							</li>
							<li>
								<img src="http://cloudcial.com/img/landing/slides/iphoneshots-2.jpg" alt="Petrichor - slider">
							</li>
							<li>
								<img src="http://cloudcial.com/img/landing/slides/iphoneshots.jpg" alt="Petrichor - slider">
							</li>
						</ul>
					</div> 
				</div>
			</div>
	        
			<div class="large-6 columns">
				<h1>Be CloudCial</h1>
				<span class="subheading">Powerful, Stylish and Modern Responsive Page Template Creator.</span>
		        <a class="download-btn" href="#" target="_blank"></a>
			</div>
			
		</div>
	</header>

	<div id="features" class="section features" data-magellan-destination="features">
		<div class="row hi-icon-wrap hi-icon-effect-3 hi-icon-effect-3b">
			<div class="large-4 columns feature">
				<span class="icon icon-browser hi-icon"></span>
				<h3>Step 1: Manage your Content</h3>
				<p>Upload your <strong>photos</strong>, <strong>videos</strong> and <strong>tracks</strong>. Create <strong>events</strong> and <strong>posts</strong>. Connect some social accounts to import their content.</p>
			</div>
			<div class="large-4 columns feature">
				<span class="icon icon-tools hi-icon"></span>
				<h3>Step 2: Customize your theme</h3>
				<p>Explore themes section. Choose the best option. Edit <strong>colors</strong>, <strong>background</strong>, <strong>fonts</strong>, <strong>pages</strong> and more.</p>
			</div>
			<div class="large-4 columns feature">
				<span class="icon icon-trophy hi-icon"></span>
				<h3>Step 3: Share your profile url</h3>
				<p>Let to your social ecosystem know everything about your profile.</p>
			</div>
		</div>
	</div>

	<div id="product" class="section product gray" data-magellan-destination="product">
		<div class="row">
			<div class="large-12 columns">
				<h2>Simple & easy to use page template creator</h2>
				<span class="subheading">Introducing the page template creator that lets you present your app in a graceful way.</span>
				<div class="row">
					<div class="small-4 columns hints iphone">
						<div class="hint hint-left hint-top">
							<h3>Modern design</h3>
							<p>Minimalistic and simple design with maximal emphasis. You will be glad to use our templates.</p>
							<span class="arrow"></span>
						</div>
						<div class="hint hint-left hint-bottom">
							<h3>Bold and Clean</h3>
							<p>It is a scientific fact that human can fully focus on just one thing at a time.</p>
							<span class="arrow"></span>
						</div>
					</div>
					<div class="small-4 columns hints iphone">
						<img src="http://cloudcial.com/img/landing/Iphone_Mockup.png" alt="">
					</div>
					<div class="small-4 columns hints iphone">
						<div class="hint hint-right hint-top">
							<h3>Amazing Design</h3>
							<p>Because your profile deserves an amazing page too.</p>
							<span class="arrow"></span>
						</div>
						<div class="hint hint-right hint-bottom">
							<h3>Easy to Customize</h3>
							<p>Try with different backgrounds, colors and font sizes. It's your baby now!</p>
							<span class="arrow"></span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="screenshot" data-magellan-destination="screenshot" class="section screenshot">
		<div class="row">
			<div class="large-12 columns carousel">
				<h2>Boom. Instant Preview.</h2>
				<span class="subheading">Instant theme preview on all devices using your content.</span>
		
				<ul class="clearing-thumbs small-block-grid-3" data-clearing>

					<!--
	                <li><a href="http://cloudcial.com/img/landing/screenshot-1b.png"><img src="http://cloudcial.com/img/landing/screenshot-1.png"></a></li>
	                -->

					<li>
						<a href="img/themes/dj/dj_theme_01.png"><img src="img/themes/dj/dj_theme_01.png"></a>
					</li>
					<li>
						<a href="img/themes/dj/dj_theme_03.png"><img src="img/themes/dj/dj_theme_03.png"></a>
					</li>
					<li>
						<a href="img/themes/digest/digest_theme_02.png"><img src="img/themes/digest/digest_theme_02.png"></a>
					</li>
					<li>
						<a href="img/themes/clubber/clubber_theme_01.png"><img src="img/themes/clubber/clubber_theme_01.png"></a>
					</li>
					<li>
						<a href="img/themes/clubber/clubber_theme_09.png"><img src="img/themes/clubber/clubber_theme_09.png"></a>
					</li>
					<li>
						<a href="img/themes/space/space_theme_01.png"><img src="img/themes/space/space_theme_02.png"></a>
					</li>
					<li>
						<a href="img/themes/space/space_theme_03.png"><img src="img/themes/space/space_theme_03.png"></a>
					</li>
					<li>
						<a href="img/themes/simple/simple_theme_01.png"><img src="img/themes/simple/simple_theme_01.png"></a>
					</li>
					<li>
						<a href="img/themes/simple/simple_theme_02.png"><img src="img/themes/simple/simple_theme_02.png"></a>
					</li>

	  			</ul>
			</div>
		</div>
	</div>


	<div id="pricing-table" class="section pricing gray" data-magellan-destination="pricing">

		<div class="row">
			<div class="large-12 quotes columns">
				<ul id="quotes1" data-orbit>
				  <li class="quote" data-orbit-slide="headline-1">
				  	<blockquote>AppLanding page looks great, I missed something like this.</blockquote>
					<span class="author">John Donga</span>
				  </li>
				  <li class="quote" data-orbit-slide="headline-2">
				  	<blockquote>I was going to buy a premium template, but now I am using AppLanding template.</blockquote>
					<span class="author">John Dongi</span>
				  </li>
				  <li class="quote" data-orbit-slide="headline-3">
				  	<blockquote>Awesome. Tweaked it a bit and got myself an ideal landing page.</blockquote>
					<span class="author">John Donga</span>
				  </li>
				</ul>
			</div>
		</div>

		<div class="row price-table">
			<div class="large-4 columns">
				<ul class="pricing-table">
				  <li class="title">Plan Free</li>
				  <li class="description">With basic features</li>
				  <li class="price">$0.00</li>
	  			  <a class="price-table-toggle">+ Show features</a>
	  			  <ul class="price-table-features">
					  <li class="bullet-item">1 free theme (Ads)</li>
					  <li class="bullet-item">2 Social Accounts</li>
					  <li class="bullet-item">0 GB</li>
				  </ul>
				  <li class="cta-button"><a class="button secondary radius" href="#">Buy Now</a></li>
				</ul>
			</div>
			<div class="large-4 columns">
				<ul class="pricing-table featured">
				  <li class="title">Plan Gold</li>
				  <li class="description">With advanced features</li>
				  <li class="price">$19.99</li>
	  			  <a class="price-table-toggle">+ Show features</a>
				  <ul class="price-table-features">
					  <li class="bullet-item">All themes (No Ads)</li>
					  <li class="bullet-item">Unlimited Accounts</li>
					  <li class="bullet-item">10 GB for contents</li>
				  </ul>
				  <li class="cta-button"><a class="button radius" href="#">Buy Now</a></li>
				</ul>
			</div>
			<div class="large-4 columns">
				<ul class="pricing-table">
				  <li class="title">Plan One</li>
				  <li class="description">With awesome features</li>
				  <li class="price">$29.99</li>
				  <a class="price-table-toggle">+ Show features</a>
				  <ul class="price-table-features">
					  <li class="bullet-item">1 theme (No Ads)</li>
					  <li class="bullet-item">6 Social Accounts</li>
					  <li class="bullet-item">1 GB for contents</li>
				  </ul>
				  <li class="cta-button"><a class="button secondary radius" href="#">Buy Now</a></li>
				</ul>
			</div>
		</div>
	</div>

	<div id="contact"  class="section contact gray" data-magellan-destination="contact">
	    <div class="row">
			<div class="large-12 columns">
				<h2>Ready to Get Started?</h2>
				<span class="subheading">If you're interested, I'd love to hear from you. Drop me a line anytime!	</span>

				<form method="post" action="#" id="contactform">
					<div>
						<label for="name">Enter your name</label>
						<input type="text" class="input-field" id="name" name="name" value="">
					</div>
					<div>
						<label for="email">Enter your e-mail</label>
						<input type="text" class="input-field" id="email" name="email" value="">
					</div>
					<div>
						<label>Type Your Message</label>
						<textarea id="message" name="message"></textarea>
					</div>
					<a id="button-send" href="#" title="Send Email" class="button" style="width:100%;">Send E-Mail</a>
					<div id="success">Your message has been successfully!</div>
					<div id="error">Unable to send your message, please try later.</div>
				</form>
			</div>
		</div>
	</div>

	<footer>
		<div class="row">
			<div class="large-6 columns">
				<ul class="inline-list">
				  <li class="copyright">2013 &copy; AppLanding Template</a></li>
				 
	  			</ul>
			</div>
			<div class="large-6 columns">
				<ul class="inline-list social-media right">
					<li><a href="http://www.facebook.com/EGrappler" class="icon icon-facebook"></a></li>
					<li><a href="htp://twitter.com/egrappler" class="icon icon-twitter"></a></li>
					<li><a href="https://plus.google.com/102572598506883739879/posts" class="icon icon-googleplus"></a></li>
				</ul>
			</div>
		</div>
	</footer>

    <!-- Js -->
    <?php    
	echo $this->Html->script('landing/jquery-1.8.2.min.js');
	echo $this->Html->script('landing/foundation.min.js');
	echo $this->Html->script('landing/functions.js');
	echo $this->Html->script('landing/jquery.nicescroll.js');
	echo $this->Html->script('landing/jquery.localscroll-1.2.7.js');
	echo $this->Html->script('landing/jquery.scrollTo-1.4.3.1.js');
	echo $this->Html->script('landing/jquery.flexslider.js');
	echo $this->Html->script('landing/custom.js');
    ?>

    <!-- Css -->
    <?php
	echo $this->Html->css('landing/flexslider.css');
	?>

</body>
</html>