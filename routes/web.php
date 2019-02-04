<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');



    Route::group(['prefix' => 'todo/'],function() {
        Route::post('create/todo','TodoController@store')->name('todo.create');

        Route::get('show/todo/{todo}','TodoController@show')->name('todo.show');
        Route::post('update/todo','TodoController@update')->name('todo.update');
        Route::get('delete/todo/{todo}','TodoController@destroy')->name('todo.delete');
        Route::get('mark/todo/{todo}','TodoController@complete')->name('todo.complete');



});