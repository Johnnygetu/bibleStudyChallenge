<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BookChapterController;
use App\Http\Controllers\DailyReadingBroadcastController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\InactiveReaderReminderController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\MessagingController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ReaderController;
use App\Http\Controllers\StreakResetController;
use App\Http\Controllers\TelegramController;
use App\Http\Controllers\TelegramGroupReadingController;
use App\Http\Controllers\TelegramLeaderboardController;
use Illuminate\Support\Facades\Route;

Route::get('test', fn () => response(['message' => 'Test'], 200));

Route::apiResource('admins', AdminController::class);

// Recipients for the messaging app's Send To picker: `?audience=all`
// returns every reader, `?audience=lagging` only the behind-schedule ones.
Route::get('messaging/readers', [MessagingController::class, 'readers'])->name('messaging.readers');

Route::get('readers/by-chat/{chatId}', [ReaderController::class, 'showByChatId']);
Route::get('readers/early-progress', [ReaderController::class, 'earlyProgressReaders'])->name('readers.early-progress');
Route::apiResource('readers', ReaderController::class);
Route::get('questions/by-chapters', [QuestionController::class, 'byChapters'])->name('questions.by-chapters');
Route::get('book-chapters', [BookChapterController::class, 'index'])->name('book-chapters.index');
Route::post('questions/bulk', [QuestionController::class, 'bulkStore'])->name('questions.bulk');
Route::apiResource('questions', QuestionController::class);
Route::apiResource('groups', GroupController::class);
Route::post('groups/assign-random', [GroupController::class, 'assignRandom'])->name('groups.assign-random');
Route::post('groups/{group}/swap', [GroupController::class, 'swapMember'])->name('groups.swap');
Route::put('groups/{group}/members/{reader}/leader', [GroupController::class, 'setLeader'])->name('groups.set-leader');
Route::get('leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
Route::get('posts', [PostsController::class, 'index'])->name('posts.index');
Route::post('posts', [PostsController::class, 'store'])->name('posts.store');
Route::post('posts/{post}/like', [PostsController::class, 'like'])->name('posts.like');
Route::delete('posts/{post}', [PostsController::class, 'destroy'])->name('posts.destroy');
// Admin removal: same note row, but any note goes and a reason is required.
Route::delete('admin/posts/{post}', [PostsController::class, 'adminDestroy'])->name('posts.admin-destroy');
Route::get('progress', [ProgressController::class, 'index'])->name('progress.index');
Route::get('readers/{reader}/plans/{plan}/daily-readings', [ReaderController::class, 'dailyReadings']);
Route::get('readers/{reader}/plans/{plan}/lag-status', [ReaderController::class, 'lagStatus']);
Route::post('readers/{reader}/plans/{plan}/save-progress', [ReaderController::class, 'saveProgress']);
Route::post('readers/{reader}/plans/{plan}/set-progress', [ReaderController::class, 'setProgress']);
Route::post('readers/{reader}/set-streak', [ReaderController::class, 'setStreak'])->name('readers.set-streak');
// Church membership answer: the reader's own yes/no from the onboarding modal
// is written straight to the is_church_member column.
Route::put('readers/{reader}/set-church-membership', [ReaderController::class, 'setChurchMembership'])->name('readers.set-church-membership');

// Church membership check: one reader is looked up in the main youth group
// and flagged when they are a member.
Route::post('readers/{reader}/check-church-membership', [ReaderController::class, 'checkChurchMembership'])->name('readers.check-church-membership');
Route::post('readers/{reader}/scores', [ReaderController::class, 'storeScore'])->name('scores.store');

// Daily streak maintenance: every reader who did not read today has their
// streak set to 0. Honour the ?processing_date override when it is present.
Route::post('streaks/reset-missed', StreakResetController::class)->name('streaks.reset-missed');

Route::get('plans/{plan}/schedule', [PlanController::class, 'schedule']);
Route::get('plans/{plan}/orders', [PlanController::class, 'orders']);
Route::patch('plans/{plan}/daily-verse-limit', [PlanController::class, 'updateDailyVerseLimit']);

// Daily broadcast: every reader gets today's reading over Telegram.
Route::post('telegram/daily-readings', DailyReadingBroadcastController::class)->name('telegram.daily-readings');

// Group reading broadcast: today's reading plan goes to the Telegram group.
Route::post('telegram/group-reading', TelegramGroupReadingController::class)->name('telegram.group-reading');

// Daily card graphic: the reading card PNG goes to the Telegram group.
Route::post('telegram/send_graphic', [TelegramController::class, 'sendDailyCardImage'])->name('telegram.send_graphic');

// Leaderboard broadcast: the standings go to the Telegram group.
Route::post('telegram/leaderboard', TelegramLeaderboardController::class)->name('telegram.leaderboard');

// Win-back reminder: readers who have not read for about a week get a nudge to return.
Route::post('telegram/inactive-readers', InactiveReaderReminderController::class)->name('telegram.inactive-readers');
Route::post('telegram', [TelegramController::class, 'webhook'])->name('telegram.webhook');
