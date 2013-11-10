<div class="row">
	<div class="col-lg-12">
		<div class="well">
			<form id="content_types" action="/<?php echo $network; ?>/collect">
				<fieldset>Content types
					<div class="form-group" style="text-align:center;">
						<?php if (!empty($account_id)): ?>
							<input type="hidden" name="account_id" value="<?php echo $account_id; ?>">
						<?php endif; ?>	
						<?php foreach ($content_types as $key => $content_type): ?>
							<label class="col-lg-2 control-label">
								<?php $checked = in_array($content_type, $types) ? 'checked':''; ?>
        						<?php echo "<input {$checked} type='checkbox' name='types[{$key}]' value={$content_type}>"; ?>
								<?php echo $content_type; ?>
    						</label>
						<?php endforeach; ?>
						<input type="submit" value="Go!" class="btn btn-primary submit_ajax">
					</div>
				</fieldset>
			</form>
		</div>
	</div>
</div>

<script type="text/javascript">
jQuery(document).ready(
    function () {
    	jQuery(".submit_ajax").unbind();
        jQuery(".submit_ajax").bind("click",
            function (event) {
            	form = jQuery("#content_types");
                var href=jQuery(form).attr('action')+"?"+jQuery(form).serialize();
                history.pushState({ uri: href }, document.title, href);
            	jQuery.ajax({
            		async :true,
            		type: 'get',
            		url:href,
            		success: function(params, status, xobj){
            			if (status == 'success') {
            				jQuery("#main").html(params);
            				assign_ajax_events("#main");
            			}
            		},
            		error: function(params, status, xobj){
            			console.log("Callback error! status:");
            			//console.log(params);
            			console.log(status);
            			//console.log(xobj);
            		},
            	});
            	event.preventDefault();
            }
        );
    }
);
</script>