<div class="row">
<div class="col-lg-4">

<div class="well">

	<form action="/<?php echo $network; ?>/addAccount">

	<fieldset>

		<legend>Add account</legend>

		<div class="form-group">

			<label class="col-lg-4 control-label" for="Username"><?php echo __("Username"); ?></label>

			<div class="input text required col-lg-6">
				<?php
	 				echo $this->form->input('username', array(
	 					'label' => false,
	 					'div'	=> false,
	 					'class'	=> 'form-control',
	 					)
	 				);
	 			?>
 			</div>
 		</div>

		<div class="form-group">

			<div class="col-lg-6 col-lg-offset-4 submit">
				<?php
					echo $this->form->end(array(
						'label'	=> 'Go',
						'class'	=> 'btn btn-primary',
						'div'	=> false,
						)
					);
				?>

			</div>

		</div>

	</fieldset>

</div>
</div>
</div>