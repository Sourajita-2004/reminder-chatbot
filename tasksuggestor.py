def suggest_task(user_id, user_tasks, current_time, free_time_duration):
    prioritized_tasks = [task for task in user_tasks if not task['is_fixed']]
    # Sort by urgency or another metric
    prioritized_tasks.sort(key=lambda x: x['urgency'], reverse=True)

    available_suggestions = []
    for task in prioritized_tasks:
        if task['estimated_time'] <= free_time_duration:  # check if it fits in the available time
            available_suggestions.append(task)

    return available_suggestions[:3]  # Returning top 3 suggestions