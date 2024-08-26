package com.BlumaEmailBackend.BlumaEmail.exception;

public class EmptyEmailInputException extends RuntimeException{

    public EmptyEmailInputException (String message){
        super(message);
    }
}
