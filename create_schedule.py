from datetime import datetime, timedelta

def create_schedule(fixed_tasks, flexible_tasks):
    schedule = []
    current_time = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

    # Schedule fixed tasks
    for task in fixed_tasks:
        schedule.append((task['due_time'], task['description']))

    # Schedule flexible tasks
    for task in flexible_tasks:
        while current_time in [t[0] for t in schedule]:  # Avoid conflict with fixed tasks
            current_time += timedelta(minutes=30)  # Adjust interval as needed
        schedule.append((current_time, task['description']))
        current_time += timedelta(minutes=30)  # Adjust interval for the next task

    # Sort tasks in the schedule by time
    schedule.sort(key=lambda x: x[0])
    return schedule