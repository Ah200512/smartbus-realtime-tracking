import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { QRScanner } from '../components/dashboard/QRScanner';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../lib/api';

export function AttendancePage() {
    const { t } = useLanguage();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const data = await api.getAttendance();
                setRecords(data);
            } catch (err) {
                console.error('Failed to load attendance', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
        
        // Polling for demo updates
        const timer = setInterval(fetchAttendance, 10000);
        return () => clearInterval(timer);
    }, []);

    // Calculate unique users
    const uniqueUsers = new Set(records.map(r => r.userId?._id)).size;
    const todayCheckins = records.length; // Simply count all fetched depending on filter logic returned by backend

    return (
        <div className="space-y-6">
            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <StatCard
                    title={t('attendance.todayCheckins')}
                    value={todayCheckins}
                    change="+12%"
                    changeType="positive"
                    icon={<ClipboardCheck className="h-5 w-5 text-primary" />}
                />
                <StatCard
                    title={t('attendance.thisWeek')}
                    value="5,234"
                    icon={<Calendar className="h-5 w-5 text-blue-500" />}
                />
                <StatCard
                    title={t('attendance.uniquePassengers')}
                    value={uniqueUsers}
                    icon={<User className="h-5 w-5 text-purple-500" />}
                />
            </motion.div>

            {/* QR Scanner + Records */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* QR Scanner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <QRScanner userId="current-user" />
                </motion.div>

                {/* Records Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2"
                >
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle>{t('attendance.recentAttendance')}</CardTitle>
                                <Badge>Today</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="table-header py-3 px-4">{t('attendance.passenger')}</th>
                                            <th className="table-header py-3 px-4">Register No.</th>
                                            <th className="table-header py-3 px-4">{t('attendance.bus')}</th>
                                            <th className="table-header py-3 px-4">Route Name</th>
                                            <th className="table-header py-3 px-4">{t('attendance.time')}</th>
                                            <th className="table-header py-3 px-4">{t('attendance.status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
                                        ) : records.length === 0 ? (
                                            <tr><td colSpan={6} className="text-center py-4">No records found</td></tr>
                                        ) : (
                                            records.map((record) => (
                                                <tr key={record._id} className="border-b border-border last:border-0">
                                                    <td className="table-cell font-medium">{record.profile?.fullName || record.userId?.username || 'Unknown'}</td>
                                                    <td className="table-cell text-muted-foreground">{record.profile?.registerNumber || '-'}</td>
                                                    <td className="table-cell text-muted-foreground">{record.busId?.busNumber || '-'}</td>
                                                    <td className="table-cell text-muted-foreground">{record.busId?.routeName || '-'}</td>
                                                    <td className="table-cell text-muted-foreground">
                                                        {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="table-cell">
                                                        <Badge variant="success">{record.status}</Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
