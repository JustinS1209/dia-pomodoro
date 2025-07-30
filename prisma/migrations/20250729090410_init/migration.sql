-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'PAUSED');

-- CreateTable
CREATE TABLE "users" (
                         "id" SERIAL NOT NULL,
                         "activeDirectoryOid" TEXT NOT NULL,
                         "name" TEXT,
                         "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         "updatedAt" TIMESTAMP(3) NOT NULL,

                         CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pomodoro_sessions" (
                                     "id" SERIAL NOT NULL,
                                     "startTime" TIMESTAMP(3) NOT NULL,
                                     "endTime" TIMESTAMP(3) NOT NULL,
                                     "duration" INTEGER NOT NULL,
                                     "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
                                     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     "updatedAt" TIMESTAMP(3) NOT NULL,

                                     CONSTRAINT "pomodoro_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pomodoro_session_users" (
                                          "userId" INTEGER NOT NULL,
                                          "pomodoroSessionId" INTEGER NOT NULL,
                                          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                          CONSTRAINT "pomodoro_session_users_pkey" PRIMARY KEY ("userId","pomodoroSessionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_activeDirectoryOid_key" ON "users"("activeDirectoryOid");

-- AddForeignKey
ALTER TABLE "pomodoro_session_users" ADD CONSTRAINT "pomodoro_session_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pomodoro_session_users" ADD CONSTRAINT "pomodoro_session_users_pomodoroSessionId_fkey" FOREIGN KEY ("pomodoroSessionId") REFERENCES "pomodoro_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
