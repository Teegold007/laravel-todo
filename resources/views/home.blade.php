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

                                <li class="active"><a href="#dashboard" aria-controls="Dashboard" role="tab" data-toggle="tab"><span><i class="fa fa-dashboard"></i></span> Dashboard </a></li>

                                <li><a href="#create" aria-controls="create" role="tab" data-toggle="tab"><span><i class="fas fa fa-plus"></i></span> create todo </a></li>

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
            <div class="tab-content">
                <div role="tabpanel" class="tab-pane active" id="dashboard">
                    <div class="Inspection_Scheduling">
                        <div class="row">
                            <button class="btn btn-sm btn-default pull-right" style="margin-right: 10px;"> <i class="fa fa-thumbs-up"></i></button>
                            <div class="col-lg-8 col-md-8 col-md-12 col-xs-12">
                                <h3><b>Todos</b></h3>
                                <div class="table-responsive">
                                    <table class="table landlord-agent-request-table table-striped table-bordered table-hover">
                                        <thead>

                                            <tr>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Date Due</th>
                                                <th>Status</th>
                                                <th>Update</th>
                                                <th>delete</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                        @foreach($todo as $todos)
                                        <tr>
                                            <td>{{$todos->title}}</td>
                                            <td>{{$todos->description}}</td>
                                            <td>{{$todos->date_due}}
                                            <td>@if($todos->status)<a  href="" class="btn  btn-info" >Completed</a>@else<a  href="{{ route('todo.complete',['todos'=>$todos])}}" class="btn  btn-primary" >mark as completed</a>@endif </td>
                                            <td> <a  href="{{ route('todo.show',['todos'=>$todos])}}" class="btn  btn-info" >update</a></td>

                                            <td> <a href="{{ route('todo.delete',['todos'=>$todos]) }}" class="btn btn-danger" >Delete</a> </td>



                                            <!--td>
                                              <button class="btn btn-danger">Decline</button>
                                            </td-->
                                        </tr>

                                        @endforeach
                                        </tbody>
                                    </table>

                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <div role="tabpanel" class="tab-pane" id="create">
                    <div class="Inspection_Scheduling">
                        {{--<a href="{{ route('landlord.create.estate') }}" data-property-url="{{ route('landlord.create.property') }}" data-estate-url="{{ route('landlord.create.estate') }}" class="pull-right Read_more add-estate-btn">Add Estate <i class="fa fa-building"></i></a>--}}
                        <h2>Add Todos </h2>
                    </div>
                    <div class="Inspection_Scheduling">
                        <div class="row ">
                            <div class="col-lg-12-col-md-12 col-sm-12 col-xs-12 ">
                                <form class="property-form" action="{{ route('todo.create') }}" method="post"  novalidate>
                                    @csrf
                                    <div class="form-group row">
                                        <div class="col-lg-3">
                                            <input type="text" name="title" class="form-control" placeholder="Title" value="{{ old('title') }}" required>
                                            <span class="text-danger title_error"></span>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-lg-3">
                                            <input type="text" name="description" class="form-control" placeholder="Description" value="{{ old('description') }}" required>
                                            <span class="text-danger title_error"></span>
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <div class="col-lg-3">
                                            <input type="date" name="date_due" class="form-control" placeholder="Date due" value="{{ old('description') }}" required>
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
