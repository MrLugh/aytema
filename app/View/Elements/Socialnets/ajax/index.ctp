<?php if(count($socialnets)): ?>

<?php
/*
$this->Paginator->options(array(
    'update' => '#socialnet_accounts',
    'evalScripts' => true,
    'before' => $this->Js->get('#socialnet_accounts')->effect('fadeOut', array('buffer' => false)),
    'complete' => $this->Js->get('#socialnet_accounts')->effect('fadeIn', array('buffer' => false)),
));
*/
?>
<ul style="list-style-type:none;">
    <?php foreach ($socialnets as $key => $account): ?>
    <li class="well <?php echo $account['Socialnet']['network'];?>" style="display:inline-block;">

        <div style="display:block;clear:both;padding:10px;width:230px;">
            <?php

            echo $this->Html->link(
                "<strong style='color:black;'>x</strong>",
                array("controller"=> "socialnets", "action" => "delete", $account["Socialnet"]["id"]),
                array(
                    "escape"    => false,
                    "title"     => "delete this {$networks[$account['Socialnet']['network']]} account",
                    "class"     => "delete_account pull-right",
                    "data-type" => "{$account['Socialnet']['network']}",
                )
            );

            ?>


            <?php if ( $account["Socialnet"]["type"] !== 'page'): ?>
            <?php $src = "socialnet/icons/ce_{$account['Socialnet']['network']}.png"; ?>
            <?php else: ?>
            <?php $src = "socialnet/icons/ce_{$account['Socialnet']['network']}_page.png"; ?>
            <?php endif; ?>

            <?php if (!empty($account["Socialnet"]["profile_url"])): ?>
            <?php 
                echo $this->Html->link(
                    $this->Html->image($src,
                        array(
                            "alt"   => "Go to {$networks[$account['Socialnet']['network']]} page",
                            "width" => "22px",
                            "heigth"=> "22px",
                        )
                    ),
                    $account['Socialnet']['profile_url'],
                    array(
                        "escape"=> false,
                        "target"=> "_blank",
                        "title" => "Go to {$networks[$account['Socialnet']['network']]} page",
                    )
                );
            ?>
            <?php endif; ?>
        </div>


        <?php
        $src = $account['Socialnet']['profile_image'];
        echo $this->Html->link(
            $this->Html->image($src,
                array(
                    "alt"   => "Go to {$networks[$account['Socialnet']['network']]} page",
                    "style" => "height:60px;",
                    "class" => "img-circle",
                )
            ),
            array(
                "controller"=> $account['Socialnet']['network'],
                "action"    => "collect",
                "?"         => "account_id=".$account["Socialnet"]["id"]
            ),
            array(
                "escape"    => false,
                "target"    => "_blank",
                "title"     => "Go to {$networks[$account['Socialnet']['network']]} page",
                "class"     => "ajax pull-left"
            )
        );
        ?>


        <div style="display:block;float:left;padding-left:10px;">
            <?php echo $account["Socialnet"]["login"];?>
        </div>

        <!--
        <?php if (count($account['Socialnet']['stats'])): ?>
            <div style="display:block;float:left;clear:both;margin-top:10px;">

                <?php $stats = json_decode($account['Socialnet']['stats'],true); ?>

                <ul style="list-style-type:none;">
                <?php foreach ($stats as $stat_name => $stat_value): ?>
                    <?php if ($stat_value):?>
                    <li style="margin-top:4px;">
                        <?php echo ucfirst($stat_name);?>
                        <strong><?php echo ucfirst($stat_value);?></strong>
                    </li>
                    <?php endif;?>    
                <?php endforeach;?>
                </ul>
            </div>
        <?php endif; ?>
        -->

        <div style="display:block;float:left;clear:both;margin-top:10px;">
        <?php
        $account['Socialnet']['stats'] = json_decode($account['Socialnet']['stats'],true);
        echo $this->element('/Contents/themes/digest/content_stats',
            array('content'   => $account['Socialnet']));

        ?>
        </div>



    </li>
    <?php endforeach; ?>
    

</ul>

<?php /*if ($this->Paginator->request->params['paging']['Socialnet']['pageCount'] > 1 ) : */?>

<!--
<ul class="pagination pagination-sm">
    <?php
        /*
        echo $this->Paginator->prev(__('<<'), 
            array('tag' => 'li'),
            null,
            array('tag' => 'li','class' => 'disabled','disabledTag' => 'a')
        );


        echo $this->Paginator->numbers(
            array('separator'=>'','currentTag'=> 'a','currentClass'=>'active','tag'=>'li','first'=>1)
        );

        echo $this->Paginator->next(__('>>'),
            array('tag' => 'li','currentClass' => 'disabled'),
            null,
            array('tag' => 'li','class' => 'disabled','disabledTag' => 'a')
        );
        */
    ?>
        </ul>
    </div>
<?php echo $this->Js->writeBuffer();?>
<?php /*endif;*/ ?>
-->


<script type='text/javascript'>

jQuery(document).ready(
    function () {

        jQuery(".delete_account").bind("click",
            function (event) {
                jQuery.ajax({
                    async:true,
                    type:"post",
                    url:this.href,
                    success: function(params, status, xobj){

                        params = jQuery.parseJSON(params);

                        flash_message(params.msg);

                        if (status == "success") {
                            reload_account_list();
                        }

                    },
                    error: function(params, status, xobj){
                        flash_message(params.responseText);
                    },

                });
                return false;
            }
        );

        assign_ajax_events('#socialnet_accounts');
    }
);

</script>

<?php else: ?>

    <strong><?php echo __("You don't have any synced account.") ?></strong>

<?php endif; ?>


