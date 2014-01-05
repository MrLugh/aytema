 <div class="row">
 <div class="col-lg-6">

<?php
	echo $this->session->flash('auth');
	echo $this->Session->flash();
?>

 <div class="well">

	<?php
		echo $this->form->create('User',array(
			'action'=> 'register',
			'class'	=>'bs-example form-horizontal'
			)
		);
	?>

	<fieldset>

		<legend>Register</legend>

		<div class="form-group">

			<label class="col-lg-3 control-label" for="UserEmail"><?php echo __("Email"); ?></label>

			<div class="input email required col-lg-7">
				<?php
	 				echo $this->form->input('email', array(
	 					'label' => false,
	 					'div'	=> false,
	 					'class'	=> 'form-control',
	 					)
	 				);
	 			?>
 			</div>
 		</div>

		<div class="form-group">

			<label class="col-lg-3 control-label" for="UserUsername"><?php echo __("Username"); ?></label>

			<div class="input text required col-lg-7">
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

			<label class="col-lg-3 control-label" for="UserFirstname"><?php echo __("Firstname"); ?></label>

			<div class="input text required col-lg-7">
				<?php
	 				echo $this->form->input('firstname', array(
	 					'label' => false,
	 					'div'	=> false,
	 					'class'	=> 'form-control',
	 					)
	 				);
	 			?>
 			</div>

 		</div>

		<div class="form-group">

			<label class="col-lg-3 control-label" for="UserLastname"><?php echo __("Lastname"); ?></label>

			<div class="input text required col-lg-7">
				<?php
	 				echo $this->form->input('lastname', array(
	 					'label' => false,
	 					'div'	=> false,
	 					'class'	=> 'form-control',
	 					)
	 				);
	 			?>
 			</div>

 		</div>

		<div class="form-group">

			<label class="col-lg-3 control-label" for="UserPassword"><?php echo __("Password"); ?></label>
			
			<div class="input password required col-lg-7">
				<?php
	 				echo $this->form->input('password', array(
	 					'label' => false,
	 					'div'	=> false,
	 					'class'	=> 'form-control',
	 					)
	 				);
	 			?>
 			</div>
 		</div>


		<div class="form-group">

			<label class="col-lg-3 control-label" for="UserPasswordConfirm"><?php echo __("Confirm"); ?></label>
			
			<div class="input password required col-lg-7">
				<?php
	 				echo $this->form->input('password_confirm', array(
	 					'type'	=> 'password',
	 					'label' => false,
	 					'div'	=> false,
	 					'class'	=> 'form-control',
	 					)
	 				);
	 			?>
 			</div>
 		</div>

		<div class="form-group">

			<div class="col-lg-7 col-lg-offset-3 submit">

				<?php
					echo $this->form->end(array(
						'label'	=> 'Register',
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