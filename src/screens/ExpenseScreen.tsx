import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { StatisticsCategory, StatisticsItem } from '../types';

const CATEGORY_STYLE: Record<string, { icon: string; tint: string; soft: string }> = {
  grocery: { icon: '🛒', tint: '#10B981', soft: '#ECFDF5' },
  food: { icon: '🍔', tint: '#F59E0B', soft: '#FFFBEB' },
  restaurant: { icon: '🍽️', tint: '#F59E0B', soft: '#FFFBEB' },
  health: { icon: '🏥', tint: '#EF4444', soft: '#FEF2F2' },
  medical: { icon: '💊', tint: '#EF4444', soft: '#FEF2F2' },
  internet: { icon: '🌐', tint: '#6366F1', soft: '#EEF0FE' },
  phone: { icon: '📱', tint: '#6366F1', soft: '#EEF0FE' },
  utility: { icon: '💡', tint: '#F59E0B', soft: '#FFFBEB' },
  fuel: { icon: '⛽', tint: '#0EA5E9', soft: '#E0F2FE' },
  gas: { icon: '⛽', tint: '#0EA5E9', soft: '#E0F2FE' },
  transport: { icon: '🚗', tint: '#0EA5E9', soft: '#E0F2FE' },
  shopping: { icon: '🛍️', tint: '#8B5CF6', soft: '#F5F3FF' },
  entertainment: { icon: '🎬', tint: '#8B5CF6', soft: '#F5F3FF' },
  rent: { icon: '🏠', tint: '#6366F1', soft: '#EEF0FE' },
  housing: { icon: '🏠', tint: '#6366F1', soft: '#EEF0FE' },
  salary: { icon: '💰', tint: '#10B981', soft: '#ECFDF5' },
  income: { icon: '💰', tint: '#10B981', soft: '#ECFDF5' },
  refund: { icon: '↩️', tint: '#10B981', soft: '#ECFDF5' },
  education: { icon: '📚', tint: '#6366F1', soft: '#EEF0FE' },
  travel: { icon: '✈️', tint: '#0EA5E9', soft: '#E0F2FE' },
  fitness: { icon: '🏋️', tint: '#10B981', soft: '#ECFDF5' },
  default: { icon: '💸', tint: '#6B7280', soft: '#F3F4F6' },
};

function categoryStyle(name: string) {
  return CATEGORY_STYLE[name.toLowerCase()] ?? CATEGORY_STYLE.default;
}

function parsePercentage(percentage: string): number {
  const match = /([\d.]+)/.exec(percentage);
  if (!match) return 0;
  const n = Number.parseFloat(match[1]);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

function formatMonth(date: string): string {
  const d = new Date(`${date}-01T00:00:00`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

function formatItemDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function MetricTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <View style={styles.metricTile}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function ItemRow({ item }: { item: StatisticsItem }) {
  const positive = item.income;
  const accent = positive ? theme.green : theme.red;
  const accentBg = positive ? theme.greenSoft : theme.redSoft;
  const titleText = item.title || item.place?.name || item.category;
  const subtitle = item.place?.name && item.title ? item.place.name : item.place?.address;

  return (
    <View style={styles.itemRow}>
      <View style={[styles.itemDot, { backgroundColor: accent }]} />
      <View style={styles.itemBody}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {titleText}
        </Text>
        {subtitle ? (
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.itemRight}>
        <View style={[styles.itemPriceBadge, { backgroundColor: accentBg }]}>
          <Text style={[styles.itemPrice, { color: accent }]}>
            {item.formatedPrice}
          </Text>
        </View>
        <Text style={styles.itemDate}>{formatItemDate(item.date)}</Text>
      </View>
    </View>
  );
}

function CategoryCard({
  category,
  index,
}: {
  category: StatisticsCategory;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index < 2);
  const isIncome = category.income;
  const accent = isIncome ? theme.green : categoryStyle(category.category).tint;
  const accentBg = isIncome ? theme.greenSoft : categoryStyle(category.category).soft;
  const pct = parsePercentage(category.percentage);
  const meta = categoryStyle(category.category);
  const itemsCount = category.items.length;

  return (
    <View style={[styles.categoryCard, cardShadow.shadow]}>
      <Pressable
        style={styles.categoryHeader}
        onPress={() => setExpanded((v) => !v)}
      >
        <View style={[styles.categoryIcon, { backgroundColor: meta.soft }]}>
          <Text style={styles.categoryIconText}>{meta.icon}</Text>
        </View>
        <View style={styles.categoryInfo}>
          <View style={styles.categoryTopRow}>
            <Text style={styles.categoryName}>
              {category.category.charAt(0).toUpperCase() +
                category.category.slice(1)}
            </Text>
            <Text style={[styles.categoryTotal, { color: accent }]}>
              {category.total}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${pct}%`,
                  backgroundColor: accent,
                },
              ]}
            />
          </View>
          <View style={styles.categoryBottomRow}>
            <Text style={styles.categoryItemsCount}>
              {itemsCount} item{itemsCount === 1 ? '' : 's'}
            </Text>
            <Text style={[styles.categoryPct, { color: accent }]}>
              {category.percentage}
            </Text>
          </View>
        </View>
        <Text style={styles.categoryChevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>

      {expanded && itemsCount > 0 ? (
        <View style={styles.itemsContainer}>
          {category.items.map((item) => (
            <ItemRow key={item._id} item={item} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function ExpenseScreen() {
  const {
    statistics,
    statisticsLoading,
    statisticsError,
    fetchStatistics,
    user,
  } = useApp();

  useEffect(() => {
    if (user) {
      void fetchStatistics();
    }
  }, [user, fetchStatistics]);

  const categories = useMemo(
    () => statistics?.categoryPrice ?? [],
    [statistics],
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={[theme.primaryDark, theme.primary, theme.violet]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.headerLabel}>MONTHLY SUMMARY</Text>
            <Text style={styles.headerTitle}>
              {statistics ? formatMonth(statistics.date) : '—'}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.refreshButton,
              (statisticsLoading || pressed) && styles.refreshPressed,
            ]}
            onPress={() => void fetchStatistics()}
            disabled={statisticsLoading}
          >
            {statisticsLoading ? (
              <ActivityIndicator size="small" color={theme.primaryDark} />
            ) : (
              <Text style={styles.refreshText}>↻</Text>
            )}
          </Pressable>
        </View>

        {statistics ? (
          <View style={styles.metricsRow}>
            <MetricTile label="Incomes" value={statistics.incomes} icon="↓" />
            <MetricTile label="Expenses" value={statistics.expenses} icon="↑" />
            <MetricTile label="Net" value={statistics.total} icon="Σ" />
          </View>
        ) : null}
      </LinearGradient>

      {statisticsError ? (
        <View style={[styles.errorBox, cardShadow.shadow]}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorText}>{statisticsError}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => void fetchStatistics()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      {!statistics && statisticsLoading ? (
        <View style={[styles.loadingBox, cardShadow.shadow]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading statistics…</Text>
        </View>
      ) : null}

      {statistics && categories.length === 0 ? (
        <View style={[styles.emptyBox, cardShadow.shadow]}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyText}>No categories this month</Text>
        </View>
      ) : null}

      {categories.length > 0 ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Text style={styles.sectionCount}>
            {categories.length} total
          </Text>
        </View>
      ) : null}

      {categories.map((cat, idx) => (
        <CategoryCard key={cat.category + idx} category={cat} index={idx} />
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const cardShadow = StyleSheet.create({
  shadow: {
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  contentContainer: {
    padding: 20,
  },
  headerCard: {
    borderRadius: theme.radius.xl,
    padding: 20,
    marginBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: theme.font.micro,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: theme.font.hero,
    fontWeight: '800',
    marginTop: 2,
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshPressed: {
    opacity: 0.75,
  },
  refreshText: {
    color: theme.primaryDark,
    fontSize: 18,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricTile: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: theme.radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  metricIcon: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: theme.font.caption,
    fontWeight: '800',
  },
  metricValue: {
    color: '#fff',
    fontSize: theme.font.body,
    fontWeight: '800',
    marginTop: 4,
  },
  metricLabel: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: theme.font.micro,
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  errorBox: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  errorEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  errorText: {
    color: theme.red,
    fontSize: theme.font.caption,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.red,
  },
  retryText: {
    color: '#fff',
    fontSize: theme.font.caption,
    fontWeight: '700',
  },
  loadingBox: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 28,
    marginBottom: 12,
    alignItems: 'center',
  },
  loadingText: {
    color: theme.textFaint,
    fontSize: theme.font.caption,
    marginTop: 8,
  },
  emptyBox: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    padding: 28,
    marginBottom: 12,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  emptyText: {
    color: theme.textSoft,
    fontSize: theme.font.body,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    color: theme.ink,
    fontSize: theme.font.title,
    fontWeight: '800',
  },
  sectionCount: {
    color: theme.textFaint,
    fontSize: theme.font.caption,
    fontWeight: '600',
  },
  categoryCard: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius.lg,
    marginBottom: 10,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  categoryIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  categoryIconText: {
    fontSize: 22,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    color: theme.ink,
    fontSize: theme.font.body,
    fontWeight: '800',
  },
  categoryTotal: {
    fontSize: theme.font.body,
    fontWeight: '800',
  },
  progressTrack: {
    height: 6,
    backgroundColor: theme.track,
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  categoryItemsCount: {
    color: theme.textFaint,
    fontSize: theme.font.micro,
    fontWeight: '500',
  },
  categoryPct: {
    fontSize: theme.font.micro,
    fontWeight: '800',
  },
  categoryChevron: {
    color: theme.textFaint,
    fontSize: 11,
    marginLeft: 12,
  },
  itemsContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.borderSoft,
    backgroundColor: '#FAFAFD',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.borderSoft,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  itemBody: {
    flex: 1,
    marginRight: 10,
  },
  itemTitle: {
    color: theme.text,
    fontSize: theme.font.caption + 1,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: theme.textFaint,
    fontSize: theme.font.micro,
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemPriceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  itemPrice: {
    fontSize: theme.font.caption,
    fontWeight: '800',
  },
  itemDate: {
    color: theme.textFaint,
    fontSize: 10,
    marginTop: 3,
  },
});
