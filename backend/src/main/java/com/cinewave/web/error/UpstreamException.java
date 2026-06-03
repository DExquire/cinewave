package com.cinewave.web.error;

/** Raised when the TMDB upstream fails or returns an unexpected response. */
public class UpstreamException extends RuntimeException {
    public UpstreamException(String message, Throwable cause) {
        super(message, cause);
    }
}
