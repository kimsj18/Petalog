package com.example.demo.util;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class CustomJWTException extends RuntimeException{

    public CustomJWTException(String msg){
        super(msg);
    }

}
