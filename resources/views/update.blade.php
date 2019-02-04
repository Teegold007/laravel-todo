@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-4 col-sm-4 col-xs-12">
                <div class="">
                    <div class="profile_left">
                        <div class="card-body">
                            <center class="m-t-30">
                                <img src="" class="img-circle" width="150">
                                <h4 class="card-title m-t-10"></h4>
                                <h5></h5>
                                <h6 class="card-subtitle"></h6>
                            </center>

                        </div>
                        <div>
                            <hr> </div>
                        <div class="card-body profile_detail">
                            <ul class="nav nav-tabs" role="tablist">

                                <li class="active"><a href="#update" aria-controls="" role="tab" data-toggle="tab"><span><i class="fa fa-dashboard"></i></span> Dashboard </a></li>



                                <li>
                                    <a href="{{ route('logout') }}"  onclick="event.preventDefault();
                                                     document.getElementById('form-logout').submit();">
                                        <span><i class="fas fa fa-sign-out"></i></span> Sign Out
                                        <form id="form-logout" action="{{ route('logout') }}" method="POST" style="display: none;">
                                            @csrf
                                        </form>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8 col-sm-8 col-xs-12">


                    <div role="tabpanel" class="tab-pane" id="update">
                            <div class="Inspection_Scheduling">
                            <div class="row ">
                                <div class="col-lg-12-col-md-12 col-sm-12 col-xs-12 ">
                                    <form class="property-form" action="{{ route('todo.update') }}" method="post"  novalidate>
                                        @csrf
                                        <div class="form-group row">
                                            <div class="col-lg-3">
                                                <input type="text" name="title" class="form-control" placeholder="Title" value="{{ $todo->title }}" >
                                                <span class="text-danger title_error"></span>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-lg-3">
                                                <input type="text" name="description" class="form-control" placeholder="Description" value="{{ $todo->description }}" required>
                                                <span class="text-danger title_error"></span>
                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <div class="col-lg-3">
                                                <input type="date" name="date_due" class="form-control" placeholder="Date due" value="{{ $todo->date_due }}" required>
                                                <span class="text-danger title_error"></span>
                                            </div>
                                        </div>


                                        <button type="submit" class="btn btn-info">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div>
    </div>
@endsection
