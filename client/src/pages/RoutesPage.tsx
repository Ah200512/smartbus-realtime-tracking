import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Route, Clock, MapPin } from 'lucide-react';

const routes = [
    {
        id: '1',
        name: 'Downtown Express',
        stops: ['Central Station', 'Market Street', 'University Ave', 'Tech Park', 'Business District'],
        schedule: '6:00 AM - 10:00 PM',
        frequency: 'Every 15 min',
        status: 'Active',
    },
    {
        id: '2',
        name: 'Campus Shuttle',
        stops: ['Main Gate', 'Library', 'Science Block', 'Sports Complex', 'Hostel Area'],
        schedule: '7:00 AM - 9:00 PM',
        frequency: 'Every 10 min',
        status: 'Active',
    },
    {
        id: '3',
        name: 'Airport Link',
        stops: ['Terminal 1', 'Terminal 2', 'City Center', 'Central Station'],
        schedule: '5:00 AM - 11:00 PM',
        frequency: 'Every 20 min',
        status: 'Active',
    },
];

export function RoutesPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6">
                {routes.map((route) => (
                    <Card key={route.id} interactive>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Route className="h-5 w-5 text-primary" />
                                    {route.name}
                                </CardTitle>
                                <Badge variant="success">{route.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Stops
                                    </p>
                                    <div className="space-y-1">
                                        {route.stops.map((stop, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm">
                                                <div className="w-2 h-2 rounded-full bg-primary/50" />
                                                {stop}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Schedule
                                    </p>
                                    <p className="text-sm">{route.schedule}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{route.frequency}</p>
                                </div>
                                <div className="flex items-end justify-end">
                                    <button className="text-sm text-primary hover:underline">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
