<?php

if (! function_exists('transaction')) {
    function transaction(Closure $callback, int $attempts = 1)
    {
        return DB::transaction(function () use ($callback) {
            return $callback();
        }, $attempts);
    }
}
