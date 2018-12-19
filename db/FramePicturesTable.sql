USE [LaunchpadFrame]
GO

/****** Object:  Table [dbo].[FramePictures]    Script Date: 12/19/2018 3:00:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[FramePictures](
	[Id] [int] NOT NULL,
	[PictureId] [int] NOT NULL,
	[FrameId] [int] NOT NULL,
	[AddedDate] [datetime] NOT NULL,
	[AddedBy] [int] NOT NULL,
	[RemovedDate] [datetime] NULL,
	[RemovedBy] [int] NULL,
	[IsApproved] [bit] NOT NULL,
	[ApprovedBy] [int] NULL,
 CONSTRAINT [PK_FramePictures] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[FramePictures]  WITH CHECK ADD  CONSTRAINT [FK_FramePictures_Frames] FOREIGN KEY([FrameId])
REFERENCES [dbo].[Frames] ([Id])
GO

ALTER TABLE [dbo].[FramePictures] CHECK CONSTRAINT [FK_FramePictures_Frames]
GO

ALTER TABLE [dbo].[FramePictures]  WITH CHECK ADD  CONSTRAINT [FK_FramePictures_Pictures] FOREIGN KEY([PictureId])
REFERENCES [dbo].[Pictures] ([Id])
GO

ALTER TABLE [dbo].[FramePictures] CHECK CONSTRAINT [FK_FramePictures_Pictures]
GO

ALTER TABLE [dbo].[FramePictures]  WITH CHECK ADD  CONSTRAINT [FK_FramePictures_Users] FOREIGN KEY([AddedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[FramePictures] CHECK CONSTRAINT [FK_FramePictures_Users]
GO

ALTER TABLE [dbo].[FramePictures]  WITH CHECK ADD  CONSTRAINT [FK_FramePictures_Users1] FOREIGN KEY([RemovedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[FramePictures] CHECK CONSTRAINT [FK_FramePictures_Users1]
GO

ALTER TABLE [dbo].[FramePictures]  WITH CHECK ADD  CONSTRAINT [FK_FramePictures_Users2] FOREIGN KEY([ApprovedBy])
REFERENCES [dbo].[Users] ([Id])
GO

ALTER TABLE [dbo].[FramePictures] CHECK CONSTRAINT [FK_FramePictures_Users2]
GO

