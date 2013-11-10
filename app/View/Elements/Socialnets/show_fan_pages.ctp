<div class="row">
<div class="col-lg-6">
<div class="well">

<form action="/facebook/addFanPages/" class="bs-example form-horizontal">

	<legend>
		<?php echo __("Would you like to add FaceBook fan pages ?"); ?>
	</legend>

	<div class="form-group">
	<?php foreach ($fan_pages as $key_fp => $fan_page): ?>

		<div class="checkbox">
	    	<label class="col-lg-2 control-label">
		        <?php echo '<input type="checkbox" name="pages['.$key_fp.']" value="'.$fan_page['id'].'">'; ?>
	    		<?php echo $fan_page['name']; ?>
		    </label>
	    </div>

    <?php endforeach; ?>
	</div>

    <div class="form-group">
    	<div class="col-lg-2">
    		<input type="submit" value="Add" class="btn btn-primary">
    	</div>
    </div>

	</div>

</form>

</div>
</div>
</div>