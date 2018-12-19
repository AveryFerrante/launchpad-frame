USE [LaunchpadFrame]
GO

/****** Object:  Table [dbo].[FrameUserPermissions]    Script Date: 12/19/2018 3:00:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FrameUserPermissions](
	[Id] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[FrameId] [int] NOT NULL,
	[CanAddUsers] [bit] NOT NULL,
	[CanRemoveUsers] [bit] NOT NULL,
	[IsReadOnly] [bit] NOT NULL,
	[CanApprovePictures] [bit] NOT NULL,
	[RequiresPictureApproval] [bit] NOT NULL,
	[CanRemovePictures] [bit] NOT NULL,
 CONSTRAINT [PK_FrameUserPermissions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[FrameUserPermissions]  WITH CHECK ADD  CONSTRAINT [FK_FrameUserPermissions_Frames] FOREIGN KEY([FrameId])
REFERENCES [dbo].[Frames] ([Id])
GO

ALTER TABLE [dbo].[FrameUserPermissions] CHECK CONSTRAINT [FK_FrameUserPermissions_Frames]
GO

ALTER TABLE [dbo].[FrameUserPermissions]  WITH CHECK ADD  CONSTRAINT [FK_FrameUserPermissions_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[FrameUserPermissions] CHECK CONSTRAINT [FK_FrameUserPermissions_Users]
GO

