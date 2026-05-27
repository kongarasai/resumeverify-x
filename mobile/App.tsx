import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Animated, 
  Dimensions, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';

const { width } = Dimensions.get('window');

interface Mission {
  id: string;
  title: string;
  xp: number;
  done: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'self' | 'other';
  text: string;
  time: string;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<'Dashboard' | 'Streaks' | 'Messages' | 'Notifications' | 'Profile'>('Dashboard');
  
  // Dashboard & Streaks State
  const [trustScore, setTrustScore] = useState(84);
  const [missions, setMissions] = useState<Mission[]>([
    { id: '1', title: 'Solve 2 LeetCode Medium tasks', xp: 100, done: true },
    { id: '2', title: 'Push 1 commit to verified GitHub', xp: 50, done: true },
    { id: '3', title: 'Review System Design microservices', xp: 75, done: false },
    { id: '4', title: 'Practice 10 aptitude questions', xp: 60, done: false },
  ]);

  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'other', text: 'Hey Arjun! Your verified trust score is looking excellent. Direct eligibility for Zoho is unlocked.', time: '2:15 PM' },
    { id: '2', sender: 'self', text: 'Thanks! I just finished auditing my GitHub commits. Should I recalculate now?', time: '2:17 PM' },
    { id: '3', sender: 'other', text: 'Yes, recalculate now to sync with the Zoho placement drive listing.', time: '2:18 PM' }
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Notifications State
  const [notifs, setNotifs] = useState([
    { id: '1', title: 'Zoho Hiring Drive Open', desc: 'Eligibility: Trust > 80. You qualify!', time: '1 hour ago', read: false },
    { id: '2', title: 'Mentor Feedback Posted', desc: 'Dr. Sen left notes on your mock interview.', time: 'Yesterday', read: true },
    { id: '3', title: 'DSA streak updated', desc: '32 Days coding milestone unlocked.', time: '2 days ago', read: true }
  ]);

  const handleToggleMission = (id: string) => {
    setMissions(missions.map(m => m.id === id ? { ...m, done: !m.done } : m));
    // Reward XP and increase trust score slightly when completing a mission
    const mission = missions.find(m => m.id === id);
    if (mission && !mission.done) {
      setTrustScore(prev => Math.min(prev + 1, 100));
    }
  };

  const handleSendMessage = () => {
    if (!newMsg.trim()) return;
    const selfMsg: ChatMessage = {
      id: String(messages.length + 1),
      sender: 'self',
      text: newMsg,
      time: 'Just now'
    };
    setMessages(prev => [...prev, selfMsg]);
    setNewMsg('');

    // Trigger mock response
    setTimeout(() => {
      const respMsg: ChatMessage = {
        id: String(messages.length + 2),
        sender: 'other',
        text: 'Got it. Recalculating your live placement index...',
        time: 'Just now'
      };
      setMessages(prev => [...prev, respMsg]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      
      {/* 1. APP HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logoText}>ResumeVerify X</Text>
          <Text style={styles.subLogoText}>Universal Career OS</Text>
        </View>
        <View style={styles.trustBadgeContainer}>
          <Text style={styles.trustLabel}>Trust</Text>
          <View style={styles.trustCircle}>
            <Text style={styles.trustValue}>{trustScore}</Text>
          </View>
        </View>
      </View>

      {/* 2. SCROLLABLE CONTENT AREA */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={{ paddingBottom: 100 }}>
        {currentTab === 'Dashboard' && (
          <View style={styles.tabContent}>
            {/* Trust Index Ring Card */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Verified Trust Circle™</Text>
              
              <View style={styles.ringGraphic}>
                <View style={[styles.innerCircle, { borderColor: trustScore >= 80 ? '#6366f1' : '#f59e0b' }]}>
                  <Text style={styles.ringScore}>{trustScore}</Text>
                  <Text style={styles.ringScoreLabel}>Index Rank</Text>
                </View>
              </View>

              <Text style={styles.verificationStatus}>
                {trustScore >= 80 ? '✓ Verified Tier-1 Eligible' : 'Moderate Placement Match'}
              </Text>
            </View>

            {/* Quick Metrics */}
            <View style={styles.metricsRow}>
              <View style={[styles.glassCard, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.metricLabel}>Readiness</Text>
                <Text style={styles.metricValue}>66%</Text>
              </View>
              <View style={[styles.glassCard, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.metricLabel}>Rank</Text>
                <Text style={styles.metricValue}>#14</Text>
              </View>
            </View>

            {/* Daily AI Missions */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Daily AI Missions</Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${(missions.filter(m => m.done).length / missions.length) * 100}%` }]} />
              </View>

              <View style={styles.missionList}>
                {missions.map(m => (
                  <TouchableOpacity 
                    key={m.id} 
                    style={[styles.missionItem, m.done && styles.missionItemCompleted]}
                    onPress={() => handleToggleMission(m.id)}
                  >
                    <View style={[styles.checkbox, m.done && styles.checkboxChecked]}>
                      {m.done && <Text style={styles.checkboxTick}>✓</Text>}
                    </View>
                    <Text style={[styles.missionText, m.done && styles.missionTextCompleted]}>{m.title}</Text>
                    <Text style={styles.missionXp}>+{m.xp}XP</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {currentTab === 'Streaks' && (
          <View style={styles.tabContent}>
            {/* Streaks Card */}
            <View style={[styles.glassCard, { alignItems: 'center' }]}>
              <Text style={styles.cardTitle}>DSA Coding Streaker</Text>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakValue}>32 Days</Text>
              <Text style={styles.streakSub}>Consistent Code Submissions Verified</Text>
            </View>

            {/* Verified Skills Grid */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Verified Skills</Text>
              <View style={styles.skillsGrid}>
                {[
                  { name: 'React (NextJS)', level: 'Expert', verified: true },
                  { name: 'Go Backend', level: 'Intermediate', verified: true },
                  { name: 'Data Structures', level: 'Expert', verified: true },
                  { name: 'PostgreSQL', level: 'Intermediate', verified: true }
                ].map((s, idx) => (
                  <View key={idx} style={styles.skillItem}>
                    <Text style={styles.skillName}>{s.name}</Text>
                    <View style={styles.skillSubRow}>
                      <Text style={styles.skillLevel}>{s.level}</Text>
                      {s.verified && <Text style={styles.skillVerifiedBadge}>✓ Verified</Text>}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {currentTab === 'Messages' && (
          <View style={styles.tabContent}>
            {/* Messages Chat Box */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Chat: Placement Officer</Text>
              
              <View style={styles.chatWindow}>
                {messages.map(msg => (
                  <View 
                    key={msg.id} 
                    style={[
                      styles.msgBubble, 
                      msg.sender === 'self' ? styles.msgSelf : styles.msgOther
                    ]}
                  >
                    <Text style={styles.msgText}>{msg.text}</Text>
                    <Text style={styles.msgTime}>{msg.time}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.chatInputRow}>
                <TextInput
                  placeholder="Ask placement team..."
                  placeholderTextColor="#6b7280"
                  value={newMsg}
                  onChangeText={setNewMsg}
                  style={styles.chatInput}
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.chatSendBtn}>
                  <Text style={styles.chatSendText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {currentTab === 'Notifications' && (
          <View style={styles.tabContent}>
            {/* Notifications Feed */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Live Notifications</Text>
              
              <View style={styles.notifList}>
                {notifs.map(n => (
                  <View key={n.id} style={[styles.notifItem, !n.read && styles.notifUnread]}>
                    <View style={styles.notifHeaderRow}>
                      <Text style={styles.notifTitle}>{n.title}</Text>
                      <Text style={styles.notifTime}>{n.time}</Text>
                    </View>
                    <Text style={styles.notifDesc}>{n.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {currentTab === 'Profile' && (
          <View style={styles.tabContent}>
            {/* Profile Overview */}
            <View style={[styles.glassCard, { alignItems: 'center' }]}>
              <View style={styles.profileAvatar}>
                <Text style={styles.profileAvatarText}>AP</Text>
              </View>
              <Text style={styles.profileName}>Arjun Prasanna</Text>
              <Text style={styles.profileSub}>B.Tech CSE • JNTU Hyderabad</Text>

              <View style={styles.profileStatusBadge}>
                <Text style={styles.profileStatusText}>✓ PLACEMENT READINESS SECURED</Text>
              </View>
            </View>

            {/* Connections Integrations */}
            <View style={styles.glassCard}>
              <Text style={styles.cardTitle}>Integrations Active</Text>
              {[
                { name: 'GitHub Sync', desc: 'Syncs verified commits & plagiarism checks', status: 'Connected' },
                { name: 'LeetCode DSA', desc: 'Daily algorithms & difficulty metrics', status: 'Connected' },
                { name: 'Digital Trust Resume', desc: 'Extracted PDF skill maps', status: 'Audited' }
              ].map((item, idx) => (
                <View key={idx} style={styles.integrationItem}>
                  <View>
                    <Text style={styles.integrationName}>{item.name}</Text>
                    <Text style={styles.integrationDesc}>{item.desc}</Text>
                  </View>
                  <Text style={styles.integrationStatus}>{item.status}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* 3. CUSTOM BOTTOM ROUTER BAR */}
      <View style={styles.bottomBar}>
        {[
          { label: 'Dashboard', icon: '📊' },
          { label: 'Streaks', icon: '🔥' },
          { label: 'Messages', icon: '💬' },
          { label: 'Notifications', icon: '🔔' },
          { label: 'Profile', icon: '👤' }
        ].map(tab => (
          <TouchableOpacity 
            key={tab.label} 
            style={styles.tabItem} 
            onPress={() => setCurrentTab(tab.label as any)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabLabel, 
              currentTab === tab.label && styles.tabLabelActive
            ]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  header: {
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 16,
    backgroundColor: '#0d0d16',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subLogoText: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: '600',
  },
  trustBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustLabel: {
    color: '#6b7280',
    fontSize: 11,
    marginRight: 6,
  },
  trustCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderWidth: 1,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustValue: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentScroll: {
    flex: 1,
    padding: 16,
  },
  tabContent: {
    gap: 16,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  ringGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  ringScore: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
  },
  ringScoreLabel: {
    color: '#6b7280',
    fontSize: 9,
  },
  verificationStatus: {
    color: '#22c55e',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
  },
  metricsRow: {
    flexDirection: 'row',
  },
  metricLabel: {
    color: '#6b7280',
    fontSize: 11,
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  missionList: {
    gap: 8,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 12,
  },
  missionItemCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    borderColor: 'rgba(34, 197, 94, 0.1)',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    borderColor: '#22c55e',
    backgroundColor: '#22c55e',
  },
  checkboxTick: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  missionText: {
    color: '#e2e8f0',
    fontSize: 11,
    flex: 1,
  },
  missionTextCompleted: {
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  missionXp: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '600',
  },
  streakEmoji: {
    fontSize: 40,
    marginVertical: 8,
  },
  streakValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  streakSub: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 4,
  },
  skillsGrid: {
    gap: 8,
  },
  skillItem: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  skillName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  skillSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  skillLevel: {
    color: '#6b7280',
    fontSize: 10,
  },
  skillVerifiedBadge: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatWindow: {
    height: 250,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  msgBubble: {
    padding: 10,
    borderRadius: 12,
    maxWidth: '80%',
  },
  msgSelf: {
    backgroundColor: '#6366f1',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  msgOther: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  msgText: {
    color: '#ffffff',
    fontSize: 11,
    leadingHeight: 15,
  },
  msgTime: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    textAlign: 'right',
    marginTop: 4,
  },
  chatInputRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#ffffff',
    fontSize: 11,
    height: 38,
  },
  chatSendBtn: {
    width: 60,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
  },
  chatSendText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  notifList: {
    gap: 8,
  },
  notifItem: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  notifUnread: {
    borderColor: 'rgba(99, 102, 241, 0.2)',
    backgroundColor: 'rgba(99, 102, 241, 0.03)',
  },
  notifHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  notifTime: {
    color: '#6b7280',
    fontSize: 8,
  },
  notifDesc: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 4,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profileAvatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileSub: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 2,
  },
  profileStatusBadge: {
    backgroundColor: 'rgba(34,197,94,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 12,
  },
  profileStatusText: {
    color: '#22c55e',
    fontSize: 9,
    fontWeight: 'bold',
  },
  integrationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  integrationName: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  integrationDesc: {
    color: '#6b7280',
    fontSize: 9,
    marginTop: 2,
  },
  integrationStatus: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    flexDirection: 'row',
    backgroundColor: '#0d0d16',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    color: '#6b7280',
    fontSize: 9,
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#6366f1',
  },
});
