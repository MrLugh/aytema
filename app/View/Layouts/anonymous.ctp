<?php
/**
 *
 * PHP 5
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.View.Layouts
 * @since         CakePHP(tm) v 0.10.0.1076
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */


?>
<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<?php echo $this->Html->charset(); ?>
	<title>

		<?php echo $title_for_layout; ?>
	</title>
	<?php
		echo $this->Html->meta('icon');


		echo $this->fetch('meta');

		echo $this->fetch('css');
		echo $this->Html->css('colorbox');
		echo $this->Html->css('bootstrap');
		echo $this->Html->css('font-awesome.min');
		echo $this->Html->css('bootstrap-bootswatch-custom');

		echo $this->fetch('script');
		echo $this->Html->script('jquery');
		echo $this->Html->script('jquery.colorbox-min');
		echo $this->Html->script('bootstrap-min');
		echo $this->Html->script('bootstrap-bootswatch-custom');
	?>
</head>
<body>

	<div class="container">

		<div id="content">

			<div id="flash">
				<?php echo $this->Session->flash(); ?>
			</div>

			<?php echo $this->fetch('content'); ?>

		</div>

	</div>

	<?php //echo $this->element('sql_dump'); ?>

	<?php echo $this->Js->writeBuffer();?>	
</body>
</html>