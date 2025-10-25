import { useQuery } from "@tanstack/react-query";
import { Trophy, Crown, Medal, Award } from "lucide-react";
import { SiDiscord, SiTelegram } from "react-icons/si";
import { CountdownTimer } from "@/components/countdown-timer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LeaderboardEntry, LeaderboardSettings } from "@shared/schema";

export default function Leaderboard() {
  const { data: settings, isLoading: settingsLoading } = useQuery<LeaderboardSettings>({
    queryKey: ["/api/leaderboard/settings"],
  });

  const { data: entries = [], isLoading: entriesLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard/entries"],
  });

  const isLoading = settingsLoading || entriesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-zinc-400">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { label: "FIRST", color: "from-yellow-600 to-yellow-500", icon: Crown };
    if (rank === 2) return { label: "SECOND", color: "from-zinc-400 to-zinc-500", icon: Medal };
    if (rank === 3) return { label: "THIRD", color: "from-amber-700 to-amber-600", icon: Award };
    return { label: "", color: "", icon: Trophy };
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-grid opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none animate-gradient-slow" />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-10">
          {/* Prize Pool */}
          {settings && (
            <div className="text-center mb-8">
              <div className="inline-block">
                <div className="text-6xl md:text-8xl font-black bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent mb-2" data-testid="text-prize-pool">
                  $ {Number(settings.totalPrizePool).toLocaleString()}
                </div>
                <div className="text-zinc-500 uppercase tracking-widest text-sm font-semibold">
                  Monthly Prize Pool
                </div>
              </div>
            </div>
          )}

          {/* Title */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl md:text-5xl font-black text-white">
              MONTHLY CODE <span className="text-red-600">MOJO</span> Leaderboard!
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Every <span className="font-bold text-white">BET</span> counts towards your score.
            </p>
            <p className="text-zinc-500 text-sm">
              The leaderboard updates every 15 minutes.
            </p>
          </div>

          {/* Countdown Timer */}
          {settings && (
            <div className="mb-8" data-testid="section-countdown">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 text-zinc-400 uppercase tracking-wider text-sm font-semibold">
                  <Trophy className="w-4 h-4" />
                  Ending In
                </div>
              </div>
              <CountdownTimer endDate={new Date(settings.endDate)} />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Contact Banner */}
        <Card className="p-8 border-zinc-800 bg-zinc-900/50 backdrop-blur mb-12 animate-fade-in">
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Want to Join the Leaderboard?</h3>
              <p className="text-zinc-400">
                Send me a private message with your <span className="font-semibold text-white">Username</span> and <span className="font-semibold text-white">Gamdom ID</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-[#5865F2] hover:bg-[#5865F2]/90 text-white min-w-[200px]"
                data-testid="button-contact-discord"
              >
                <a href="https://discord.com/users/mojotxkick" target="_blank" rel="noopener noreferrer">
                  <SiDiscord className="w-5 h-5 mr-2" />
                  Discord: mojotxkick
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-[#26A5E4] hover:bg-[#26A5E4]/90 text-white min-w-[200px]"
                data-testid="button-contact-telegram"
              >
                <a href="https://t.me/mojotx" target="_blank" rel="noopener noreferrer">
                  <SiTelegram className="w-5 h-5 mr-2" />
                  Telegram: mojotx
                </a>
              </Button>
            </div>
          </div>
        </Card>

        {/* Current Leaderboard Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Current Leaderboard</h2>
        </div>

        {entries && entries.length > 0 ? (
          <div className="space-y-8">
            {/* Top 3 Title Cards */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topThree.map((entry, index) => {
                  const badge = getRankBadge(entry.rank);
                  const Icon = badge.icon;
                  
                  return (
                    <Card
                      key={entry.id}
                      className={`relative overflow-hidden border-2 ${
                        entry.rank === 1 ? 'border-yellow-500/30 glow-card-gold' :
                        entry.rank === 2 ? 'border-zinc-400/30 glow-card-silver' :
                        'border-amber-600/30 glow-card-bronze'
                      } bg-zinc-900/80 backdrop-blur hover-elevate transition-all animate-scale-in`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      data-testid={`card-leaderboard-${entry.rank}`}
                    >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-5`}></div>
                      
                      <div className="relative p-6 space-y-4">
                        {/* Rank Badge */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className={`text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${badge.color} bg-clip-text text-transparent`}>
                                #{entry.rank} • {badge.label}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Username */}
                        <div className="text-center py-4">
                          <div className="text-2xl font-black text-white mb-2" data-testid={`text-username-${entry.rank}`}>
                            {entry.username}
                          </div>
                          <div className="text-sm text-zinc-500">
                            Wagered: <span className="font-bold text-zinc-300">${Number(entry.wagered).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Prize */}
                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r ${badge.color} text-white`}>
                            <span className="text-2xl font-black" data-testid={`text-prize-${entry.rank}`}>
                              ${Number(entry.prize).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Remaining Players */}
            {remaining.length > 0 && (
              <div className="space-y-3">
                {remaining.map((entry, index) => (
                  <Card
                    key={entry.id}
                    className="border-zinc-800 bg-zinc-900/50 backdrop-blur hover-elevate transition-all animate-fade-in"
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    data-testid={`card-leaderboard-${entry.rank}`}
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-6">
                        {/* Rank */}
                        <div className="flex items-center justify-center min-w-[60px]">
                          <span className="text-3xl font-black text-zinc-600">
                            #{entry.rank}
                          </span>
                        </div>

                        {/* Username */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white truncate" data-testid={`text-username-${entry.rank}`}>
                            {entry.username}
                          </h3>
                          <p className="text-sm text-zinc-500">
                            ${Number(entry.wagered).toLocaleString()}
                          </p>
                        </div>

                        {/* Prize */}
                        <div className="text-right">
                          <Badge className="bg-red-600/20 text-red-500 border-red-600/30 text-lg font-bold px-4 py-2">
                            <span data-testid={`text-prize-${entry.rank}`}>
                              ${Number(entry.prize).toLocaleString()}
                            </span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Card className="p-16 text-center border-zinc-800 bg-zinc-900/50">
            <Trophy className="w-20 h-20 text-zinc-700 mx-auto mb-6 opacity-50" />
            <p className="text-zinc-500 text-lg">No leaderboard entries yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
