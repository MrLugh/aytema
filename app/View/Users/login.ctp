<div class="row">
<div class="col-lg-4">

<?php
	echo $this->session->flash('auth');
	echo $this->Session->flash();
?>

<div class="well">

	<?php
		echo $this->form->create('User',array(
			'action'=> 'login',
			'class'	=>'bs-example form-horizontal'
			)
		);
	?>

	<fieldset>

		<legend>Login</legend>

		<div class="form-group">

			<label class="col-lg-4 control-label" for="UserUsername"><?php echo __("Username"); ?></label>

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

			<label class="col-lg-4 control-label" for="UserPassword"><?php echo __("Password"); ?></label>
			
			<div class="input password required col-lg-6">
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

			<div class="col-lg-6 col-lg-offset-4 submit">
				<?php
					echo $this->form->end(array(
						'label'	=> 'Login',
						'class'	=> 'btn btn-primary',
						'div'	=> false,
						)
					);
				?>

				<?php
					echo $this->html->link('Sign up',
						array(
							'controller'=>'users',
							'action'	=>'register'
						),
						array(
							'class'	=> 'btn btn-link'
						)
					);
				?>
			</div>

		</div>

	</fieldset>

</div>
</div>
</div>