def generate_routine(profession):
    routines = {
        "software engineer": [
            "09:00 AM - Standup meeting",
            "10:00 AM - Code review",
            "12:00 PM - Lunch",
            "01:00 PM - Development time",
            "03:00 PM - Team collaboration",
            "05:00 PM - End of workday"
        ],
        "student": [
            "08:00 AM - Class",
            "10:00 AM - Study",
            "12:00 PM - Lunch",
            "01:00 PM - Study group",
            "04:00 PM - Gym",
            "06:00 PM - Review notes"
        ]
    }
    return routines.get(profession, [])