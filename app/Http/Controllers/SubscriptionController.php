<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscription;
use Illuminate\Support\Facades\Validator;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $messages = [
            'name.required' => 'El campo Nombre es obligatorio.',
            'email.required' => 'El campo Email es obligatorio.',
            'email.email' => 'El campo :attribute debe ser una dirección de correo electrónico válida.',
            'name.max' => 'El campo Nombre no debe exceder los :max caracteres.',
            'email.max' => 'El campo Email no debe exceder los :max caracteres.',
        ];

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
        ], $messages);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $sanitizedData = [
            'name' => filter_var($request->name, FILTER_SANITIZE_STRING),
            'email' => filter_var($request->email, FILTER_SANITIZE_EMAIL),
        ];

        return response()->json(['message' => 'Se ha suscrito correctamente!'], 200);
    }
}
