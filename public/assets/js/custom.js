$(document).ready(function(){
$.ajaxSetup({
    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
});

//Style Checkbox
    $(".checkbox-style").bootstrapSwitch();
//WAIT BUTTON
let waitBtn = "<i class='fa fa-spin fa-cog'> </i> Please Wait.....";

//Notification
let notify= (type,msg) => {
    Lobibox.notify(type,{
        // Available types 'warning', 'info', 'success', 'error'
        msg:msg,
        size:'mini',
        position:'right top',
        delay:5000,
        delayIndicator:false,
        icon:false,
    })
}

//Add Estate
    $(document).on('click','.add-estate-btn',function(event){
       event.preventDefault();
      var _this = $(this)
         _this.html("Add Property <i class='fa fa-home'> </i>").addClass('add-property-btn').removeClass('add-estate-btn')
        _this.siblings("h2").text("Add Estate")
      let form = $("form.property-form");
          form.attr("action",_this.data("estate-url"))
          form.find("select[name='property_type']").removeAttr("required","required").parents(".form-group").hide();
          form.find("input[name='house_number']").hide()
    });

    //Toggle between Add Property/Estate
    $(document).on('click','.add-property-btn',function(event){
        event.preventDefault();
        var _this = $(this)
        _this.html("Add Estate <i class='fa fa-building'> </i>").addClass('add-estate-btn').removeClass('add-property-btn')
        _this.siblings("h2").text("Add Property");
        let form = $("form.property-form");
        form.attr("action",_this.data("property-url"))
        form.find("select[name='property_type']").attr("required","required").parents(".form-group").show()
        form.find("input[name='house_number']").show()
    });

  //Landlord Create Property
    $(document).on('submit','.property-form',function(){
        let _this = $(this);
        let _url = _this.attr('action');
        let _submitBtn = _this.find("button[type='submit']");
        let btnVal = _submitBtn.html();
            _submitBtn.html(waitBtn).attr('disabled','disabled');
        $.ajax({
           url:_url,
           type:"post",
           data:new FormData(this),
           processData:false,
           contentType:false,
           success:function(data) {
               //Hide property form and show Apartment form
               notify('success',data.message);
               window.location.href = data.route;
           },
           error:function(data) {
               if (data.status === 422) {
                   var response = JSON.parse(data.responseText);
                   notify('warning',response.message);
                   $('.text-danger').text('');
                   $.each(response.errors,function(elem,val){
                       $('.' + elem + '_error').text(val);
                   })
               }else{
                  notify('warning','Internal server error check connection setting')
               }
               _submitBtn.html(btnVal).removeAttr('disabled');
           },
           complete:function() {
               _submitBtn.html(btnVal).removeAttr('disabled');
            }
        });
          return false;
    });

 //Calculate Management Fee for Rent Input when adding apartment
    $(document).on('keyup mouseup blur','#apartment-rent-input',function(){
        var rentInput = $(this).val();
        let unicode = ' \u{0023}';

        // calculate mgt fee
        let management_percent = parseInt($(".management-percent").val());
        if (management_percent) {
            let management_fee = Math.ceil((management_percent/100)*rentInput);
            //Display the management fee
            $(".mgt_fee").text("Mgt.fee: "+unicode + management_fee);
            if (!rentInput) {
                $(".mgt_fee").text('')
        }

        }


    });

    //Make Apartment Image required when occupancy is vacant when adding apartment
    $(document).on('change','select[name="occupancy"]',function () {
       var occupancy = $(this).val();
       if (occupancy == "vacant") {
           $(".apartment-image").attr("required","required");
       } else {
           $(".apartment-image").removeAttr("required");
       }
    });

    //Simple class that can be called to show confirmation box before proceeding (Get Request Only)
    $(document).on('click','.confirm-process',function(event){
        event.preventDefault();
        let theme = $(this).data("theme"); //Available theme supervan,material,modern
        let title = $(this).data("title");
        let url = $(this).attr("href");
        $.confirm({
            title:title,
            theme:theme,//Available theme supervan,material,modern
            buttons:{
                ok:{
                    text:'Proceed',
                    action:function(){
                     window.location.href = url
                    }
                },
                close:{

                }
            }
        })
    });

    //Check the value of apartment room field against the ensuite field
    $(document).on('keyup mouseup blur','.apartment_rooms',function(){
       var  roomValue = Number($(this).val());
      // console.log(roomValue);
       var  ensuiteElem = $(".apartment_ensuites");
           ensuiteElem.attr("max",roomValue);
        if (roomValue < ensuiteElem.val()){
            $(".ensuites_error").text('Ensuite must be equal or less than the number of rooms.');
        } else {
            $(".ensuites_error").text('');
        }
    });
    //show error message when ensuite field is greater than room field
    $(document).on('keyup mouseup blur','.apartment_ensuites',function () {
        var  ensuiteValue = Number($(this).val());
        var  roomValue = Number($(".apartment_rooms").val());
        if (ensuiteValue != 0) {
            if (roomValue < ensuiteValue ){
                $(".ensuites_error").text('Ensuite must be equal or less than the number of rooms.');
            } else {
                $(".ensuites_error").text('');
            }
        } else {
            $(".ensuites_error").text('');
        }

    });

    //Confirm for post request (SYNCHRONOUS)
    $(document).on('click','.confirm-post',function(event){
        event.preventDefault();
        var _this = $(this);
        let theme = $(this).data("theme");
        let title = $(this).data("title");
        let url = $(this).attr("href");
        $.confirm({
            title:title,
            theme:theme,//Available theme supervan,material,modern
            buttons:{
                ok:{
                    text:'Proceed',
                    action:function(){
                        _this.parents("form").trigger("submit");
                    }
                },
                close:{

                }
            }
        })

    });

    //Editable Text
    $(".editable").editable();

    //User Registration
    /* Show apartment Id for tenant registration */
    $(document).on('change','.form-registration select[name="role"]',function(){
        var role = $(this).val();
           if (role == "Tenants") {
               $(".apartment-group").html(`
                  <div class="col-md-12">
                    <label>Apartment Id</label>
                    <input type="text" name="apartment_id" class="form-control" required>
                  </div>
            `).removeClass("hidden");
           } else {
               $(".apartment-group").html(``).addClass("hidden");
           }

    });

    //Agent Add Alpm
    $(document).on('submit','.add-alpm',function(){
       var _this = $(this);
       var _url = _this.attr("action");
       var _submitBtn = _this.find("button[type='submit']");
            _submitBtn.html(waitBtn);
       $.ajax({
         url:_url,
         type:"post",
         data:_this.serialize(),
         success:function(data) {
             $(".form-control").val('');
             notify('success',data.message)
         },
         error:function (data) {
             if (data.status === 422) {
                 var response = JSON.parse(data.responseText);
                 notify('warning',response.message)
                 $('.text-danger').text('')
                 $.each(response.errors,function(elem,val){
                     $('.' + elem + '_error').text(val);
                 })
             }else{
                 notify('warning','Internal server error check connection setting')
             }
         },
         complete:function () {
             _submitBtn.html("Add ALPM");
         }
       });
        return false
    });

    //Agent Invite
    $(document).on('submit','.agent-invite-tenant',function(){
       var _this = $(this);
       var _url = _this.attr("action");
       var _submitBtn = _this.find("button[type='submit']");
                        _submitBtn.html(waitBtn);
        $.ajax({
            url:_url,
            type:"post",
            data:_this.serialize(),
            success:function(data) {
                notify('success',data.message);
                $(".form-control").val('');
                $(".text-danger").text('')
            },
            error:function(data) {
                if (data.status === 422) {
                    var errors =  JSON.parse(data.responseText)
                    notify('error',errors.message)
                }else if(data.status === 403) {
                    notify('error','Authorization Error, You\'re not an Agent to this property');
                } else {
                    notify('error','Internal server error, please check connection settings');
                }
            },
            complete:function() {
                _submitBtn.html("<span class='fa fa-user' aria-hidden='true'></span>Invite Tenant")
            }
        });
        return false;
    });

    // Init a timeout variable to be used below
    var timeout = null;
    //Rent Calculator(Home Page) On Change of Input field
    $(document).on('keyup','.calculator-input',function(){
       var amount = $(this).val();
       var cycle = $("select[name='rent-plan']").val();
     //  var total = rentCalculator(amount,cycle);
     //  $(".rent-total").html("\t&#8358;"+total);
        if(!amount) {
            $(".rent-total").html("\t&#8358; 0.00" );
            return;
        }
       //Wait for the user to stop typing
       clearTimeout(timeout);
        // Make a new timeout set to go off in 800ms
        timeout = setTimeout(function () {
           $.get('rent/calculator/' + amount + '/' + cycle,function(data){
               $(".rent-total").html("\t&#8358;" + data);
           });
        }, 500);
    });
    //Rent Calculator(Home Page) On Change of Select field
    $(document).on('change',"select[name='rent-plan']",function(){
        var amount = $('.calculator-input').val();
        var cycle = $(this).val();
        if(!amount) {
            $(".rent-total").html("\t&#8358; 0.00" );
            return;
        }
        $.get('rent/calculator/' + amount + '/' + cycle,function(data){
            $(".rent-total").html("\t&#8358;" + data);
        });
    });

    //Update User Account Setting
    $(document).on('submit','.update-account-details',function(){
        var _this = $(this);
        var _url = _this.attr("action");
        var _submitBtn = _this.find("button[type='submit']");
        var btnVal = _submitBtn.html();
        _submitBtn.html(waitBtn);
        $.ajax({
            url:_url,
            type:"post",
            data:new FormData(this),
            processData:false,
            contentType:false,
            success:function(data) {
                $(".text-danger").text('');
                notify('success',"Profile updated, please wait.......");
                setTimeout(function(){
                    window.location.reload(true);
                },3000);
            },
            error:function(data){
                if (data.status == 422) {
                    var response = JSON.parse(data.responseText)
                    notify('error',response.message);
                    $(".text-danger").text('');
                    $.each(response.errors,function(key,val){
                        $("." + key + "_error").text(val);
                    });
                }
            },
            complete:function() {
                _submitBtn.html(btnVal)
            }
        });

        return false;
    });

    //Find lgas of state
    $(document).on('change','.states-list',function () {
        var _this = $(this);
        var parentForm = _this.parents("form");
            var btnVal = parentForm.find("button[type='submit']").html();
            parentForm.find("button[type='submit']").attr('disabled','disabled').html(waitBtn);
        var state = _this.val();
        $.get(_this.data("url") + "/" + state,function(data){

          var selectLgas = _this.parents(".state-element").next(".lga-element").children("select");
          selectLgas.html(`
            <option value=""> Select LGA </option>
          `);
          $.each(data.lgas,function(elem,val){
             selectLgas.append(`
             <option value="`+ val.name +`">`+ val.name +`</option>
             `);
          });
        })
        .fail(function () {
            console.log('error occurred')
        })
        .always(function () {
            parentForm.find("button[type='submit']").removeAttr("disabled").html(btnVal);
        })
    });

    //Validate Recharge Amount and Trigger Paystack form
    $(document).on('submit','.validation-recharge-wallet',function(){
       var _this = $(this);
       var _url = _this.attr("action");
       var _submitBtn =  _this.find("button[type='submit']");
       var btnVal = _submitBtn.html();
                    _submitBtn.html(waitBtn).attr("disabled","disabled");
       $.ajax({
          url:_url,
          type:"post",
          data:_this.serialize(),
          success:function (data) {
              var rechargeForm = $(".recharge-wallet");
                  rechargeForm.find("input[name='amount']").val(data.amount);
                  rechargeForm.trigger("submit");
          },
          error:function(data) {
              if (data.status == 422) {
                  var errors = JSON.parse(data.responseText);
                  notify('error',errors.message);
              } else {
                  notify('error','Error occurred, please check connection settings.');
              }
              _submitBtn.html(btnVal).removeAttr("disabled");
          }
       });
       return false;
    });

    //Tenant Pay Rent
    $(document).on('submit','.tenant-pay-rent',function(){
       var _this = $(this);
       var _url =_this.attr("action");
       var _submitBtn = _this.find("button[type='submit']");
       var btnVal = _submitBtn.html();
                    _submitBtn.html(waitBtn).attr("disabled","disabled");
       $.ajax({
         url:_url,
         type:"post",
         data:_this.serialize(),
         success:function (data) {
             if (data.channel == "paystack") {
                 var paystackRentForm = $(".pay-rent-paystack");
                 paystackRentForm.find("input[name='amount']").val(data.amount);
                 paystackRentForm.trigger("submit");
             } else {
                 notify('success',data.message);
                 setTimeout(function(){
                    window.location.reload();
                 },2000);
             }
         },
         error:function(data){
             var errorMsg = "Error occurred, please check connection settings";
             if (data.status === 422) {
                 var response = JSON.parse(data.responseText);
                 if (response.errors) {
                     errorMsg = response.errors["payment_channel"];
                 } else {
                     errorMsg = response.message;
                 }
             }
             notify('error',errorMsg);
         },
         complete:function() {
             _submitBtn.html(btnVal).removeAttr("disabled");
         }
       });
        return false;
    });

    //Send Report
    $(document).on('submit','.send-report',function(){
        var _this = $(this);
        var _url =_this.attr("action");
        var _submitBtn = _this.find("button[type='submit']");
        var btnVal = _submitBtn.html();
        _submitBtn.html(waitBtn).attr("disabled","disabled");
        $.ajax({
            url:_url,
            type:"post",
            data:new FormData(this),
            processData:false,
            contentType:false,
            success:function (data) {
              _this.find(".form-control").val('');
                notify('success','Your report has been sent, Please wait.......');
              setTimeout(function(){
                  window.location.reload(true);
              },1500);
            },
            error:function(data){
                if (data.status === 422) {
                    var response = JSON.parse(data.responseText);
                      notify('error',response.message);
                      $(".text-danger").text('');
                     $.each(response.errors,function(key,val){
                        $("." + key + "_error").text(val)
                     });
                } else {
                    notify('error','Error occurred, Please connection settings');
                }

            },
            complete:function() {
                _submitBtn.html(btnVal).removeAttr("disabled");
            }
        });
        return false;
    });

    //(Manual Sending Invitation to Agent for property management)
    $(document).on('submit','.landlord-update-property-lpm',function(){
        var _this = $(this);
        var _url = _this.attr("action");
        var _submitBtn = _this.find("button[type='submit']");
                        _submitBtn.html(waitBtn);
        $.ajax({
            url:_url,
            type:"post",
            data:_this.serialize(),
            success:function(data) {
                _this.parents(".modal").modal("hide");
                notify("success",data.message);
                if (data.action == 'reload') {
                  setTimeout(function(){
                      window.location.reload(true);
                  },1500);
                }
            },
            error:function (data) {
                if(data.status === 422) {
                    var response = JSON.parse(data.responseText);
                    if (response.errors) {
                        $.each(response.errors,function(key,val){
                            notify('error',response.errors[key]);
                        });
                    } else {
                        notify('errror',response.message)
                    }

                } else {
                    notify('error','Error occurred, please check connection settings');
                }
            },
            complete:function() {
                _submitBtn.html("Invite");
            }
        });
        return false;
    });

    //Referral User(Landlord) Invitation
    $(document).on('submit','.referral-invite-landlord',function(){
       var _this = $(this);
       var _url = _this.attr("action");
       var _submitBtn = _this.find("button[type='submit']");
       var btnVal = _submitBtn.html();
                    _submitBtn.html(waitBtn);
       $.ajax({
          url:_url,
          type:"post",
          data:_this.serialize(),
          success:function(data) {
              _this.find(".form-control").val('');
              notify('success','Invitation sent successfully');
          },
          error:function(data) {
              $(".text-danger").text('');
              if (data.status == 422) {
               var response = JSON.parse(data.responseText);
                notify('error',response.message);
                if (response.reminder) {
                    $(".email_error").html(`
                    <a href="`+ response.reminder +`" class="send-referral-invitation"><u><strong>Resend Invitation</strong></u></a>
                    `);
                }
                if (response.errors) {
                    $(".email_error").text(response.errors["email"])
                }
              } else {
                  notify('error','Error occurred, Please check connection settings');
              }
          },
          complete:function() {
              _submitBtn.html(btnVal)
          }
       });

        return false;
    });

    //Tenant Transfer Funds To LiSaver
    $(document).on('submit','.tenant-transfer-funds',function(){
       var _this = $(this);
       var _url = _this.attr("action");
       var _submitBtn = _this.find("button[type='submit']");
       var btnVal = _submitBtn.html();
                    _submitBtn.html(waitBtn);
       $.ajax({
          url:_url,
          type:"post",
          data:_this.serialize(),
          success:function(data) {
              $(".wallet-balance").text(data.walletBalance);
              $(".lisaver-total-balance").text(data.liSaverTotalBalance);
              $(".lisaver-repository-balance").text(data.liSaverRepositoryBalance);
              $(".lisaver-contributory-balance").text(data.liSaverContributoryBalance);
              _this.find(".form-control").val('');
              _this.parents(".modal").modal("hide");

          },
          error:function (data) {
              if (data.status === 422) {
                  var response = JSON.parse(data.responseText);
                      if (response.errors) {
                          notify('error',response.errors["amount"]);
                      } else {
                          notify('error',response.message);
                      }
              } else {
                  notify('error','Error occurred, Please check connection settings');
              }
          },
          complete:function() {
              _submitBtn.html(btnVal);
          }
       });
        return false;
    });
    $(document).on('change','select[name="message_type"]',function(){
        var messageType = $(this).val();
        if (messageType == "message") {

            $(".priority-element").hide().find("select").attr("disabled","disabled").removeAttr("required");

        } else {
            $(".priority-element").show().find("select").attr("required","required").removeAttr("disabled");
        }
    });

    $(document).on('click','.add-more-images',function(event){
        event.preventDefault();
       $(this).siblings(".gallery-element").append(`
            <br/> <input type="file" name="image[]" class="form-control"/>
       `);
    });

    //Agent Adding Property
    $(document).on('change','.lpm-select-landlord',function(){
       let value = $(this).val();

        if (value) {
           $(".new-landlord-details").hide();
        } else {
            $(".new-landlord-details").show();
        }
    });

   $(document).on('change','.image-input',handleFiles);


});

function handleFiles(e) {
    var ctx = document.getElementsByClassName('canvas').getContext('2d');
    var reader  = new FileReader();
    var file = e.target.files[0];
    // load to image to get it's width/height
    var img = new Image();
    img.onload = function() {
        // scale canvas to image
        ctx.canvas.width = 120;
        ctx.canvas.height = 80;
        // draw image
        ctx.drawImage(img, 0, 0
            , 100, 80
        );
    }
    // this is to setup loading the image
    reader.onloadend = function () {
        img.src = reader.result;
    }
    // this is to read the file
    reader.readAsDataURL(file);
}

