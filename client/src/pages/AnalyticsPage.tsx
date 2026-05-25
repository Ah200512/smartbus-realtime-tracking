import { motion } from 'framer-motion';
import { useAppStore } from '../stores/appStore';
import { AnalyticsChart } from '../components/dashboard/AnalyticsChart';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { TrendingUp, Users, Clock, Activity } from 'lucide-react';

export function AnalyticsPage() {
    const { stats, analytics } = useAppStore((state) => ({
        stats: state.stats,
        analytics: state.analytics,
    }));

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <StatCard
                    title="Weekly Ridership"
                    value="5,990"
                    change="+8.2%"
                    changeType="positive"
                    icon={<TrendingUp className="h-5 w-5 text-primary" />}
                />
                <StatCard
                    title="Avg Daily Users"
                    value="856"
                    change="+3.1%"
                    changeType="positive"
                    icon={<Users className="h-5 w-5 text-blue-500" />}
                />
                <StatCard
                    title="Avg Trip Duration"
                    value="28 min"
                    icon={<Clock className="h-5 w-5 text-purple-500" />}
                />
                <StatCard
                    title="Peak Hour"
                    value="8-9 AM"
                    icon={<Activity className="h-5 w-5 text-success" />}
                />
            </motion.div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <AnalyticsChart
                        data={analytics}
                        type="area"
                        title="Ridership Trends"
                        dataKey="ridership"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <AnalyticsChart
                        data={analytics}
                        type="bar"
                        title="Attendance by Day"
                        dataKey="attendance"
                    />
                </motion.div>
            </div>

            {/* Additional Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Route Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="table-header py-3 px-4">Route</th>
                                        <th className="table-header py-3 px-4">Daily Avg</th>
                                        <th className="table-header py-3 px-4">On-Time %</th>
                                        <th className="table-header py-3 px-4">Satisfaction</th>
                                        <th className="table-header py-3 px-4">Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { route: 'Downtown Express', avg: 245, onTime: 94, satisfaction: 4.8, trend: '+5%' },
                                        { route: 'Campus Shuttle', avg: 312, onTime: 91, satisfaction: 4.6, trend: '+12%' },
                                        { route: 'Airport Link', avg: 178, onTime: 88, satisfaction: 4.4, trend: '+2%' },
                                    ].map((row) => (
                                        <tr key={row.route} className="border-b border-border last:border-0">
                                            <td className="table-cell font-medium">{row.route}</td>
                                            <td className="table-cell">{row.avg}</td>
                                            <td className="table-cell">{row.onTime}%</td>
                                            <td className="table-cell">⭐ {row.satisfaction}</td>
                                            <td className="table-cell text-success">{row.trend}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
