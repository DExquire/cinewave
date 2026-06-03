package com.cinewave.web.error;

import java.time.Instant;

/** Uniform error body returned to the client. */
public record ApiError(Instant timestamp, int status, String error, String message, String path) {}
