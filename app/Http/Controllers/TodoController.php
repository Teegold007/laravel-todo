<?php

namespace App\Http\Controllers;

use App\Todo;
use Illuminate\Http\Request;
use Auth;

class TodoController extends Controller
{
     public function __construct()
    {
        $this->middleware('auth');
        $this->middleware(function($request, $next){
            $this->user = Auth::user();
            return $next($request);
        });
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $this->validate($request,[
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'date_due' => 'required|date',

        ]);
       // dd($request->all());
        $todo = new Todo;
        $todo->title = $request->title;
        $todo->description = $request->description;
        $todo->date_due = $request->date_due;
        $todo->user_id = $this->user->id;
        $todo->save();

        return redirect(route('home'))->with('info','you have added a task');



    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function show(Todo $todo)

    {
        $todo;
        return view('update',compact('todo'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function complete(Todo $todo)

    {
        //
        $record= Todo::find($todo->id);
        $record->status = 1;
        $record->save();
        return redirect(route('home'))->with('info','you have just completed a task');

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Todo $todo)
    {
        $this->validate($request,[
            'title' => 'string|max:255',
            'description' => 'string|max:255',
            'date_due' => 'date',

        ]);
        $data = $request->except('_tokens');

        Todo::updateOrCreate(
            ['user_id' => $this->user->id],
            $data
        );
        return redirect(route('home'))->with('info','you have just updated a task');


    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Todo  $todo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Todo $todo)
    {
        //
        $record= Todo::find($todo->id);
        $record->delete();

        return redirect(route('home'))->with('info','you have just delete a task');
    }
}
