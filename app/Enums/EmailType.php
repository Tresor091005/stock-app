<?php

namespace App\Enums;

enum EmailType:string
{
    case LOW_STOCK = 'low_stock';
    case DAILY_REPORT = 'daily_report';
}
