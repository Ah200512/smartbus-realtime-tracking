import { useAppStore } from '../stores/appStore';
import Bus3DMap from '../components/Bus3DMap';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MapPin } from 'lucide-react';

export function MapPage() {
    const buses = useAppStore((state) => state.buses);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Live Fleet Map
                        </CardTitle>
                        <Badge variant="success">{buses.length} Active Buses</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <Bus3DMap buses={buses} showUserMarker={false} heightClassName="h-[calc(100vh-250px)]" />
                </CardContent>
            </Card>
        </div>
    );
}
