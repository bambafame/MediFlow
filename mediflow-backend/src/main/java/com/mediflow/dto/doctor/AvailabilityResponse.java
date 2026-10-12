package com.mediflow.dto.doctor;

import java.time.DayOfWeek;
import java.time.LocalTime;

public record AvailabilityResponse(

    Long availabilityId,
    Long doctorId,
    DayOfWeek dayOfWeek,
    LocalTime startTime,
    LocalTime endTime,
    boolean available
) {
}