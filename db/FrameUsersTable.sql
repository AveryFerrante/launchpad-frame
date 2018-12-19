USE [LaunchpadFrame]
GO

/****** Object:  Table [dbo].[FrameUsers]    Script Date: 12/19/2018 3:00:10 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FrameUsers](
	[Id] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[FrameId] [int] NOT NULL,
	[AddedDate] [datetime] NOT NULL,
	[AddedBy] [int] NOT NULL,
	[RemovedDate] [datetime] NULL,
	[RemovedBy] [int] NULL,
	[HasAccepted] [bit] NOT NULL,
	[AcceptedDate] [datetime] NULL,
 CONSTRAINT [PK_FrameUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[FrameUsers]  WITH CHECK ADD  CONSTRAINT [FK_FrameUsers_Frames] FOREIGN KEY([FrameId])
REFERENCES [dbo].[Frames] ([Id])
GO

ALTER TABLE [dbo].[FrameUsers] CHECK CONSTRAINT [FK_FrameUsers_Frames]
GO

ALTER TABLE [dbo].[FrameUsers]  WITH CHECK ADD  CONSTRAINT [FK_FrameUsers_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[FrameUsers] CHECK CONSTRAINT [FK_FrameUsers_Users]
GO

ALTER TABLE [dbo].[FrameUsers]  WITH CHECK ADD  CONSTRAINT [FK_FrameUsers_Users1] FOREIGN KEY([AddedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[FrameUsers] CHECK CONSTRAINT [FK_FrameUsers_Users1]
GO

ALTER TABLE [dbo].[FrameUsers]  WITH CHECK ADD  CONSTRAINT [FK_FrameUsers_Users2] FOREIGN KEY([RemovedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[FrameUsers] CHECK CONSTRAINT [FK_FrameUsers_Users2]
GO

